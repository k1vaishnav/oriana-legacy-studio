/**
 * One-time clone: copy an entire Sanity dataset (documents + image assets)
 * from one project to another.
 *
 * Used when moving the CMS to a client's own Sanity project: everything the
 * site reads — pages, categories, photos, ticks, brands, films, stories,
 * settings — lands in the new project with the same ids, keys, and order,
 * and every image is re-uploaded (asset references are rewired to the new
 * uploads). Drafts are not copied; publish first.
 *
 *   OLD_PROJECT_ID=4exmsnbt OLD_DATASET=production \
 *   NEW_PROJECT_ID=<new-id> NEW_DATASET=production \
 *   SANITY_API_TOKEN=<new-project-editor-token> \
 *   node scripts/clone-sanity-project.mjs
 */
import { createClient } from "@sanity/client";

const oldProjectId = process.env.OLD_PROJECT_ID ?? "4exmsnbt";
const oldDataset = process.env.OLD_DATASET ?? "production";
const newProjectId = process.env.NEW_PROJECT_ID;
const newDataset = process.env.NEW_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!newProjectId) throw new Error("Set NEW_PROJECT_ID.");
if (!token) throw new Error("Set SANITY_API_TOKEN (new project's Editor token).");

const oldClient = createClient({
  projectId: oldProjectId,
  dataset: oldDataset,
  apiVersion: "2025-01-01",
  useCdn: false,
});
const newClient = createClient({
  projectId: newProjectId,
  dataset: newDataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

// 1 — Image assets: download bytes from the old CDN, upload to the new project.
const assets = await oldClient.fetch(
  `*[_type == "sanity.imageAsset"]{ _id, url, originalFilename, mimeType }`,
);
console.log(`assets to copy: ${assets.length}`);
const assetIdMap = new Map();
for (const [i, asset] of assets.entries()) {
  const res = await fetch(asset.url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${asset.originalFilename}`);
  const uploaded = await newClient.assets.upload("image", Buffer.from(await res.arrayBuffer()), {
    filename: asset.originalFilename ?? `image-${i}.jpg`,
    contentType: asset.mimeType ?? undefined,
  });
  assetIdMap.set(asset._id, uploaded._id);
  if ((i + 1) % 10 === 0 || i + 1 === assets.length) console.log(`  uploaded ${i + 1}/${assets.length}`);
}

// 2 — Documents: everything but assets, with system fields stripped and
// asset references rewired to the new uploads. Cross-document references
// (film picks, …) keep their ids, which are preserved verbatim.
const rewriteRefs = (node) => {
  if (Array.isArray(node)) return node.map(rewriteRefs);
  if (node && typeof node === "object") {
    if (node._type === "reference" && typeof node._ref === "string" && assetIdMap.has(node._ref)) {
      return { ...node, _ref: assetIdMap.get(node._ref) };
    }
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "_rev" || k === "_createdAt" || k === "_updatedAt") continue;
      out[k] = rewriteRefs(v);
    }
    return out;
  }
  return node;
};

const docs = await oldClient.fetch(`*[!(_type in ["sanity.imageAsset", "sanity.fileAsset"])]`);
console.log(`documents to copy: ${docs.length}`);
for (const [i, doc] of docs.entries()) {
  await newClient.createOrReplace(rewriteRefs(doc));
  if ((i + 1) % 10 === 0 || i + 1 === docs.length) console.log(`  copied ${i + 1}/${docs.length}`);
}

// 3 — Verify counts match on both sides.
for (const type of ["portfolioPage", "brand", "film", "wedding"]) {
  const [a, b] = await Promise.all([
    oldClient.fetch(`count(*[_type == "${type}"])`),
    newClient.fetch(`count(*[_type == "${type}"])`),
  ]);
  console.log(`${type}: old=${a} new=${b}${a === b ? " ✓" : "  MISMATCH!"}`);
}
const [aLib, bLib] = await Promise.all([
  oldClient.fetch(`count(*[_id == "portfolioPage"][0].categories[].photos[])`),
  newClient.fetch(`count(*[_id == "portfolioPage"][0].categories[].photos[])`),
]);
console.log(`wall photos: old=${aLib} new=${bLib}${aLib === bLib ? " ✓" : "  MISMATCH!"}`);
console.log("\nClone complete. Point VITE_SANITY_PROJECT_ID at the new project and redeploy.");
