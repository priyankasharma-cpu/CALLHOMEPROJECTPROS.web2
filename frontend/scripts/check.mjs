import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { routes } from "./routes.mjs";
import { services } from "../src/data/services.js";
import { serviceImage } from "../src/data/serviceImages.js";
assert.equal(new Set(services.map((s) => s.slug)).size, services.length);
const knownPaths = new Set(routes.map((route) => route.path));
for (const route of routes) {
  const html = await readFile(
    new URL(
      `../../dist${route.path === "/" ? "" : route.path}/index.html`,
      import.meta.url,
    ),
    "utf8",
  );
  assert.ok(html.includes("<h1"), `Missing h1: ${route.path}`);
  assert.ok(
    html.includes('rel="canonical"'),
    `Missing canonical: ${route.path}`,
  );
  assert.ok(
    !html.includes("Loading your next step"),
    `Unresolved route: ${route.path}`,
  );
  assert.ok(!html.includes("tel:undefined"));
  assert.ok(!html.includes("tel:null"));
  for (const link of html.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)"/g)) {
    const path = link[1].split("?")[0];
    if (!path.startsWith("/assets/") && !path.startsWith("/images/")) {
      assert.ok(
        knownPaths.has(path),
        `Broken internal link ${path} on ${route.path}`,
      );
    }
  }
  assert.equal(
    (html.match(/<h1[ >]/g) || []).length,
    1,
    `One h1 required: ${route.path}`,
  );
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    assert.ok(
      /\balt="[^"]+"/.test(match[0]),
      `Image needs alt text: ${route.path}`,
    );
    const src = match[0].match(/\bsrc="(\/images\/[^"]+)"/);
    if (src) await stat(new URL(`../../dist${src[1]}`, import.meta.url));
  }
}
for (const service of services) {
  for (const size of ["small", "large"]) {
    const image = serviceImage(service.slug, size);
    const bytes = await readFile(
      new URL(`../public${image.src}`, import.meta.url),
    );
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP", image.src);
    assert.ok(bytes.length < 400000, `Optimize ${image.src}`);
  }
}
for (const name of ["home-hero", "kitchen", "contractors"]) {
  const file = await stat(
    new URL(`../public/images/${name}.webp`, import.meta.url),
  );
  assert.ok(file.size < 350000, `${name} image should be optimized`);
}
console.log(`Validated ${routes.length} prerendered routes and image budgets.`);
