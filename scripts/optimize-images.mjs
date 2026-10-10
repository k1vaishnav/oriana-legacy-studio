// Rebuild only from the approved local archive; never fetch replacement photos.
import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const archive = path.join(root, "src/assets");
const output = path.join(root, "public/img");
const manifest = {};
const generated = new Set();
await mkdir(output, { recursive: true });
for (const file of (await readdir(archive)).filter(name => /\.(avif|webp|jpe?g|png)$/i.test(name)).sort()) {
  const key = file.replace(/\.[^.]+$/, "").replace(/-(?:480|800|1200|1600)$/, "");
  if (manifest[key]) throw new Error(`Duplicate image key: ${key}`);
  const input = await readFile(path.join(archive, file));
  const meta = await sharp(input).rotate().metadata();
  const { width, height } = meta.autoOrient;
  const max = Math.min(width, 1600);
  const widths = [...new Set([...[320,480,800,1200,1600].filter(size => size < max), max])];
  const sources = {};
  for (const size of widths) {
    const base = sharp(input).rotate().resize({ width: size, withoutEnlargement: true }).toColorspace("srgb");
    sources[size] = {};
    for (const format of ["avif", "webp", "jpeg"]) {
      const name = `${key}-${size}.${format === "jpeg" ? "jpg" : format}`;
      const encoder = format === "avif" ? base.clone().avif({ quality: 55, effort: 4 })
        : format === "webp" ? base.clone().webp({ quality: 76 })
        : base.clone().jpeg({ quality: 80, progressive: true, mozjpeg: true });
      await encoder.toFile(path.join(output, name));
      sources[size][format] = `/img/${name}`;
      generated.add(name);
    }
  }
  const stats = await sharp(input).resize(20, 20, { fit: "inside" }).stats();
  const color = `#${stats.channels.slice(0, 3).map(c => Math.round(c.mean).toString(16).padStart(2, "0")).join("")}`;
  const placeholder = await sharp(input).rotate().resize(16, 16, { fit: "inside" }).blur().webp({ quality: 35 }).toBuffer();
  manifest[key] = { width, height, ratio: width / height, color,
    lqip: `data:image/webp;base64,${placeholder.toString("base64")}`, widths, sources,
    src: sources[max].jpeg, avifSrc: sources[max].avif, webpSrc: sources[max].webp };
  console.log(`${key}: ${width}x${height}, ${widths.length} responsive sizes`);
}
// Delete stale generated images only within this resolved output directory.
// Approved sources stay in src/assets for repeatable builds.
for (const file of await readdir(output)) {
  if (!generated.has(file) && /\.(avif|webp|jpe?g|png)$/i.test(file)) await rm(path.join(output, file));
}
await writeFile(path.join(root, "src/lib/images.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Generated ${generated.size} files for ${Object.keys(manifest).length} approved images.`);
