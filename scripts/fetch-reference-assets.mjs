/**
 * Temporary placeholder asset fetch.
 *
 * Pulls photographs and film references from the House On The Clouds site so the
 * new editorial layout can be judged against real, full-bleed photography
 * instead of placeholders. THESE ARE ANOTHER STUDIO'S COPYRIGHTED ASSETS. They
 * are here to be looked at during design review and must be replaced with
 * Oriana's own photography before this site goes anywhere near a domain.
 *
 * Run with: node scripts/fetch-reference-assets.mjs
 */
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "src", "assets", "reference");

const CDN = "https://images.squarespace-cdn.com/content/v1/60b40cb3dd6dc9347755b5ab";

/* [localName, uuid, width, caption] — the caption becomes the alt text, so it
   has to describe the photograph rather than the file it came from. */
const PHOTOS = [
  [
    "hero-cinematic-ceremony",
    "c581f840-0f23-425d-907a-a2bad1bae4e6/SIDD1017+copy",
    2000,
    "Bride in a red lehenga during a South Asian wedding ceremony",
  ],
  [
    "story-sangeeta-jake",
    "1777651001048-SXK3VF6EIDHML4PH6UI3/cover+(1)+00ou+copy",
    2000,
    "Newlywed couple embracing outdoors after their wedding",
  ],
  [
    "story-reva-zach",
    "1728309731397-7SX5RFVHER5BFEH3P790/LONA2136+9090",
    1600,
    "Couple walking together after their wedding ceremony",
  ],
  [
    "story-alia-ranbir",
    "1670478908751-2XMF94Y8YGB1BMS4VIIP/SHOW647",
    1600,
    "Newlywed couple at an outdoor Mumbai wedding",
  ],
  [
    "story-manisha-christopher",
    "1728985824718-ASSAMHEN4GRU7U6EE26K/AYUS2602+last",
    1600,
    "Couple celebrating at a destination wedding in Singapore",
  ],
  [
    "portrait-bride-veil",
    "1e4a2f03-f9c4-4457-9f79-723e33ac4a7d/SUHA0838+2233",
    1600,
    "Bride in a veil looking towards the light",
  ],
  [
    "portrait-groom-suit",
    "4a00dce3-bd1d-4d69-b5f5-1284090047eb/HB_22749+65",
    1600,
    "Groom in a formal suit waiting during the wedding day",
  ],
  [
    "portrait-ceremony-detail",
    "7f12f49f-5beb-40be-b559-d3c8bcb5dbce/AYUS5656+copy",
    1600,
    "Guests watching a wedding ceremony",
  ],
  [
    "portrait-bride-laugh",
    "66ef1ca7-da97-490a-9afe-3f6b2fbc056c/Bridelan+Paris+-+Anamika+Knanna+Harper%27s+Bazaar+6+copy",
    1600,
    "Bride laughing during her wedding day",
  ],
  [
    "portrait-couple-laugh",
    "060230ca-92ca-4998-b4c5-df9a9a7eaf9d/0H1A6527+copy+3",
    1400,
    "Newlyweds laughing together",
  ],
  [
    "portrait-ritual-hands",
    "67baa040-63bf-4b7e-bfc0-a4662b919690/AYUS5834+Post+01",
    1600,
    "Hands during a wedding ritual",
  ],
  [
    "portrait-groom-portrait",
    "e958ce89-7e95-49fc-8526-677223bf5217/VKR69940+002",
    1600,
    "Groom photographed during a wedding",
  ],
  [
    "portrait-bride-window",
    "fa31f3fd-6e1d-4429-b8ba-bb377e2cbaea/002",
    1600,
    "Bride standing by a window on her wedding day",
  ],
  [
    "portrait-dance",
    "047e8e4c-6b7c-4010-9c1c-9daa679e5cf1/0H1A9717+(1)",
    1400,
    "Newlyweds dancing at their wedding reception",
  ],
  [
    "portrait-lehenga",
    "b3186deb-5416-4d14-bef0-8b0b787a6657/VKR60499",
    1600,
    "Bride in a lehenga during the wedding",
  ],
  [
    "detail-hands-ring",
    "306b3c30-8166-4514-82d9-1c1263929d2c/0H1A4354+(1)small",
    1200,
    "Close detail of a bride's hands",
  ],
  [
    "detail-table",
    "1db82b11-0d5e-446f-bfef-3bee15ed4f8a/P1+small",
    1400,
    "Wedding reception table setting",
  ],
  [
    "detail-bouquet",
    "182278ae-6cf7-4e21-8d9c-d71475bb6086/8d14b0c5-a6e1-4f0c-beab-ec9c5c522141",
    1200,
    "Wedding bouquet detail",
  ],
  [
    "detail-couple-arms",
    "7c8eab50-267f-4d49-88ed-f6d38491515f/IMG_2341",
    1200,
    "Newlywed couple walking arm in arm",
  ],
  [
    "detail-venue",
    "3a7209bd-6e46-4684-8556-eabb73185b0d/IMG_2338",
    1200,
    "Wedding venue decorated for the ceremony",
  ],
  [
    "detail-first-dance",
    "971584ca-9693-45a1-974c-1ef1ccbe8ec0/IMG_8405",
    1200,
    "Newlyweds during their first dance",
  ],
  [
    "detail-ceremony",
    "c2d6b1f0-33bc-4b14-afb6-4a71e94a513d/IMG_8450",
    1200,
    "Guests gathered for a wedding ceremony",
  ],
  [
    "detail-candid",
    "7b1356e0-1b88-4e48-8f11-2c9939b0e34a/IMG_2339",
    1200,
    "Candid moment between wedding guests",
  ],
  [
    "film-tamanna-dan",
    "79d4994b-3266-47f6-88fe-789254f9e0e3/888999+save",
    1600,
    "Still from a wedding film",
  ],
  [
    "film-sid-saloni",
    "80c27c1f-2552-47b6-9e68-566d4fc9f659/sid+saloni.remini-enhanced",
    1600,
    "Still from a destination wedding film",
  ],
  [
    "film-alisha-rahul",
    "85c583f0-fa69-4b6b-a7e2-26c6c9da70be/kkjk+copy",
    1600,
    "Still from a pre-wedding film",
  ],
  [
    "film-zina-zoya",
    "f27f9563-6fb3-4349-a812-9adf23b5fd23/YOGL6961+(sss1)",
    1600,
    "Still from a wedding film",
  ],
  [
    "film-prerna-neelaabh",
    "de3c890e-5ea6-4eda-84f0-c8f927007d51/9B6A3577",
    1600,
    "Still from a wedding film trailer",
  ],
  [
    "film-eshieta-sarthak",
    "1831013a-1767-4270-be7e-c0618fdfd6cc/AYUS3354+copy",
    1600,
    "Still from a wedding teaser film",
  ],
  [
    "wide-venue-night",
    "3b5087c6-a3ed-4a4e-9617-8332c38ca134/SIDD8608+full+2",
    2000,
    "Wedding reception venue lit for the evening",
  ],
  [
    "wide-coastal",
    "1623453283834-GT9UR8BV9W7WXYQ4EPR6/V_KL9752",
    2000,
    "Couple photographed on the coast",
  ],
];

await mkdir(outDir, { recursive: true });

const results = [];
for (const [name, slug, width, caption] of PHOTOS) {
  // The filename part carries literal + ' ( ) characters. They must stay
  // percent-encoded: decoding the + as a space 404s.
  const url = `${CDN}/${slug}?format=${width}w`;
  const file = path.join(outDir, `${name}.jpg`);
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) throw new Error(`suspiciously small (${buf.length} bytes)`);
    await writeFile(file, buf);
    const { size } = await stat(file);
    results.push({ name, ok: true, kb: Math.round(size / 1024), caption });
    process.stdout.write(`ok   ${name} ${Math.round(size / 1024)}kB\n`);
  } catch (error) {
    results.push({ name, ok: false, error: String(error), caption });
    process.stdout.write(`FAIL ${name} ${String(error)}\n`);
  }
}

const failed = results.filter((r) => !r.ok);
process.stdout.write(`\n${results.length - failed.length}/${results.length} downloaded\n`);
if (failed.length) {
  process.stdout.write(`failed: ${failed.map((f) => f.name).join(", ")}\n`);
}
