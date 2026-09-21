import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer, loadEnv } from "vite";
import { routes } from "./routes.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.resolve(root, "../dist");
const env = loadEnv("production", root, "VITE_");
const origin = (env.VITE_SITE_URL || "https://callhomeprojectpros.com").replace(
  /\/$/,
  "",
);
const template = await readFile(path.join(out, "index.html"), "utf8");
const server = await createServer({
  root,
  mode: "production",
  server: { middlewareMode: true },
  appType: "custom",
});
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
try {
  const { render } = await server.ssrLoadModule("/src/entry-server.jsx");
  for (const route of routes) {
    const body = await render(route.path);
    const title = `${route.title} | Call Home Project Pros`;
    const graph = [
      {
        "@type": "Organization",
        "@id": origin + "/#organization",
        name: "Call Home Project Pros",
        url: origin,
      },
      { "@type": "WebSite", name: "Call Home Project Pros", url: origin },
      ...(route.schema ? [route.schema] : []),
    ];
    const metadata = `<link rel="canonical" href="${origin}${route.path}"/><meta name="robots" content="${route.noindex ? "noindex, follow" : "index, follow"}"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(route.description)}"/><meta property="og:url" content="${origin}${route.path}"/><meta property="og:type" content="${route.schema?.["@type"] === "Article" ? "article" : "website"}"/><script id="page-schema" type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c")}</script>`;
    const html = template
      .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
      .replace(
        /<meta name="description"[^>]*\/>/,
        `<meta name="description" content="${escape(route.description)}"/>`,
      )
      .replace("</head>", metadata + "</head>")
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
    const directory = path.join(out, route.path.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), html);
    if (route.path === "/404")
      await writeFile(path.join(out, "404.html"), html);
  }
  await writeFile(
    path.join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
      .filter((r) => !r.noindex)
      .map((r) => `<url><loc>${origin}${r.path}</loc></url>`)
      .join("")}</urlset>`,
  );
  await writeFile(
    path.join(out, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
  );
  console.log(
    `Prerendered ${routes.length} complete routes, sitemap, and robots.txt.`,
  );
} finally {
  await server.close();
}
