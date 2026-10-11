/**
 * Repair: stamp `_key` on brand gallery images missing one.
 *
 * An earlier re-curation wrote gallery image objects without `_key`, and the
 * Studio locks any such list with a "Missing keys" error until every item
 * has one. This walks the four sub-brands' galleries and stamps a stable key
 * on key-less items only — photos, captions, and order are never touched, so
 * Studio edits made since are preserved.
 *
 *   node scripts/recurate-brands.mjs
 *   SANITY_API_TOKEN=<editor-token> node scripts/recurate-brands.mjs --write
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";

// Minimal `.env` support (no dependency): exported shell vars win.
const envFromFile = {};
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) envFromFile[m[1]] = m[2];
  }
}
const env = (k) => process.env[k] ?? envFromFile[k];

const projectId = env("SANITY_PROJECT_ID") ?? env("VITE_SANITY_PROJECT_ID");
const dataset = env("SANITY_DATASET") ?? env("VITE_SANITY_DATASET") ?? "production";
const token = env("SANITY_API_TOKEN");
const write = process.argv.includes("--write");

if (!projectId) throw new Error("Set SANITY_PROJECT_ID (or VITE_SANITY_PROJECT_ID).");
if (write && !token) throw new Error("Set SANITY_API_TOKEN (Editor role, from sanity.io/manage).");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: token ?? undefined,
  useCdn: false,
});

const SLUGS = ["baby-crew-studios", "deor-fashion", "orion-events", "odonata-republic"];

for (const slug of SLUGS) {
  const doc = await client.fetch(`*[_type == "brand" && slug.current == $slug][0]`, { slug });
  if (!doc) {
    console.log(`skip   ${slug} — no such brand`);
    continue;
  }
  const gallery = Array.isArray(doc.gallery) ? doc.gallery : [];
  const missing = gallery.filter((g) => g && typeof g === "object" && !g._key).length;
  console.log(`${missing === 0 ? "ok     " : "repair "}${slug}: ${gallery.length} photos, ${missing} missing keys`);
  if (!write || missing === 0) continue;
  await client.createOrReplace({
    ...doc,
    gallery: gallery.map((g, i) =>
      g && typeof g === "object" && !g._key ? { ...g, _key: `gallery-${slug}-${i + 1}` } : g,
    ),
  });
}

if (!write) console.log("\nDry run — re-run with --write to apply.");
else console.log("\nDone: every gallery photo has a key.");
