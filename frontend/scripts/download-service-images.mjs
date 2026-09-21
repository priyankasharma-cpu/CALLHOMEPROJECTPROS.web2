import { mkdir, writeFile } from "node:fs/promises";
import { serviceImages } from "../src/data/serviceImages.js";
const directory = new URL("../public/images/services/", import.meta.url);
await mkdir(directory, { recursive: true });
const entries = Object.entries(serviceImages).filter(
  ([slug]) => slug !== "furnace-services",
);
for (let i = 0; i < entries.length; i += 4) {
  await Promise.all(
    entries.slice(i, i + 4).map(async ([slug, item]) => {
      for (const [size, width] of [
        ["small", 640],
        ["large", 1200],
      ]) {
        const url = `https://images.pexels.com/photos/${item.id}/pexels-photo-${item.id}.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=${width}&q=78`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${slug}: ${response.status}`);
        await writeFile(
          new URL(`${slug}-${size}.webp`, directory),
          Buffer.from(await response.arrayBuffer()),
        );
      }
      console.log(`Downloaded ${slug}`);
    }),
  );
}
const response = await fetch(
  "https://images.pexels.com/photos/920378/pexels-photo-920378.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=1000&q=80",
);
if (!response.ok) throw new Error("Consultation photo unavailable");
await writeFile(
  new URL("../public/images/homeowner-phone.webp", import.meta.url),
  Buffer.from(await response.arrayBuffer()),
);
