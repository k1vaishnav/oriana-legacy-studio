/**
 * One-time backfill: tick the portfolio wall's existing frames.
 *
 * Datasets seeded before the "Shows in filters" checklist existed have all 30
 * wall frames unticked (`categories: null`), so every filtered view on the
 * website falls back to archive photos while the Studio shows no ticks. This
 * script ticks each frame exactly like a fresh seed would (mirroring the
 * built-in filter groups), matched by photo asset — reordering or caption
 * edits in the Studio do not confuse it.
 *
 * Safe to re-run: frames that already have ticks are left untouched, unknown
 * photos are reported and skipped, and without `--write` it only prints what
 * it WOULD do (dry run). Pass `--force` to overwrite existing ticks with the
 * map below (used when re-assigning the whole wall, e.g. after deleting a
 * filter) — still dry-run unless `--write` is also given.
 *
 *   node scripts/backfill-portfolio-categories.mjs            # dry run
 *   SANITY_API_TOKEN=<editor-token> node scripts/backfill-portfolio-categories.mjs --write
 *   SANITY_API_TOKEN=<editor-token> node scripts/backfill-portfolio-categories.mjs --force --write
 *
 * Project/dataset resolve from SANITY_PROJECT_ID / SANITY_DATASET, the
 * VITE_SANITY_* equivalents, or a local `.env` file — same as `cms:seed`.
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
const force = process.argv.includes("--force");

if (!projectId) throw new Error("Set SANITY_PROJECT_ID (or VITE_SANITY_PROJECT_ID).");
if (write && !token)
  throw new Error("Set SANITY_API_TOKEN (Editor role, from sanity.io/manage).");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: token ?? undefined,
  useCdn: false,
});

/**
 * Archive key → the filters its frame belongs to.
 *
 * Every frame sits in at least one filter (nothing unticked); the deleted
 * "venue" filter appears nowhere, so no photo carries a tick the Studio can
 * no longer show. Assignments follow the photo content (couple portraits →
 * candid/intimate, temple jewellery & garlands → traditional, outdoor
 * pre-wedding-style shoots → pre, church frames → christian, haldi frames →
 * haldi).
 */
const CATEGORIES_BY_KEY = {
  "home-hero-user": ["candid", "intimate"],
  "hero-traditional-intimate": ["candid", "intimate"],
  "calicut-cinematic-wedding-hero": ["candid"],
  "kerala-cinematic-wedding-film-still": ["candid"],
  "calicut-church-wedding-ceremony": ["traditional", "christian"],
  "church-golden-altar": ["traditional", "christian"],
  "portrait-bride-sunlight": ["candid", "intimate", "haldi", "pre"],
  "closing-cta-user": ["candid", "intimate", "pre"],
  "ceremony-temple-ritual": ["traditional"],
  "ceremony-south-asian-prewedding": ["traditional"],
  "church-altar-candid": ["traditional", "christian"],
  "church-outside-joy": ["traditional", "christian"],
  "haldi-bride-with-friends": ["candid", "intimate", "traditional", "haldi", "pre"],
  "detail-bride-henna-face": ["traditional", "haldi", "pre"],
  "detail-bouquet": ["haldi", "pre"],
  "detail-bride-groom-feet": ["candid", "traditional", "intimate"],
  "detail-reception-cake": ["candid", "traditional", "intimate"],
  "detail-reception-monochrome": ["candid", "intimate"],
  "instagram-01": ["candid", "pre"],
  "instagram-02": ["candid", "pre"],
  "instagram-07": ["candid", "pre"],
  "instagram-08": ["candid", "pre"],
  "instagram-03": ["candid", "traditional", "intimate"],
  "instagram-04": ["candid", "intimate"],
  "instagram-05": ["candid", "traditional", "intimate"],
  "instagram-06": ["candid", "traditional", "intimate"],
  "instagram-09": ["candid", "intimate", "pre"],
  "instagram-10": ["candid", "intimate", "pre"],
  "instagram-11": ["candid", "intimate", "pre"],
  "instagram-12": ["candid", "intimate"],
};

// Seed uploads store the archive key as the asset filename (`<key>.jpg`),
// so an asset reference resolves back to its key even after reorder/caption
// edits in the Studio.
const assets = await client.fetch(`*[_type == "sanity.imageAsset"]{ _id, originalFilename }`);
const keyByAssetId = new Map(
  (assets ?? [])
    .filter((a) => typeof a.originalFilename === "string" && a.originalFilename.endsWith(".jpg"))
    .map((a) => [a._id, a.originalFilename.slice(0, -".jpg".length)]),
);

const doc = await client.fetch(`*[_type == "portfolioPage" && _id == "portfolioPage"][0]`);
if (!doc) throw new Error('No "portfolioPage" document — run `npm run cms:seed` first.');
// NOTE: the whole document is fetched (not a projection) and written back
// with only `library` changed — projecting a subset here once wiped the
// page's other fields, so never narrow this query.
if (!Array.isArray(doc.library) || doc.library.length === 0) {
  console.log("Library is empty — nothing to tick.");
  process.exit(0);
}

let updated = 0;
let skippedTicked = 0;
let skippedUnknown = 0;
const next = doc.library.map((item, index) => {
  const ref = item?.photo?.asset?._ref;
  const key = ref ? keyByAssetId.get(ref) : undefined;
  const wanted = key ? (CATEGORIES_BY_KEY[key] ?? null) : null;
  const current = Array.isArray(item?.categories) ? item.categories : [];
  const sameAsWanted =
    wanted !== null &&
    current.length === wanted.length &&
    wanted.every((c) => current.includes(c));
  if (!force && current.length > 0) {
    skippedTicked++;
    console.log(`keep   #${index} ${key ?? "?"} (${current.join(",")})`);
    return item;
  }
  if (!wanted) {
    skippedUnknown++;
    console.log(`skip   #${index} ${item?.caption ?? "(no caption)"} — photo not in the archive set`);
    return item;
  }
  if (force && sameAsWanted) {
    skippedTicked++;
    console.log(`keep   #${index} ${key} (already [${current.join(",")}])`);
    return item;
  }
  updated++;
  const verb = force && current.length > 0 ? "retick" : "tick";
  console.log(
    `${verb}   #${index} ${key} [${current.join(",") || "unticked"}] -> [${wanted.join(",")}]`,
  );
  return { ...item, categories: wanted };
});

if (!write) {
  console.log(
    `\nDry run: ${updated} would be ticked, ${skippedTicked} already ticked, ${skippedUnknown} skipped. Re-run with --write to apply.`,
  );
  process.exit(0);
}

await client.createOrReplace({ ...doc, library: next });
console.log(`\nDone: ${updated} ticked, ${skippedTicked} kept, ${skippedUnknown} skipped.`);
