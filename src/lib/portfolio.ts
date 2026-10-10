import type { ImageKey } from "./image-manifest";

/**
 * Individual wedding stories.
 *
 * The slugs are the site's long-tail search assets: "wedding photographer at
 * [venue]" is a real query, and a page that names the venue, the district and
 * the kind of day is the only way to be found for it. So every entry carries a
 * venue and a location, and they appear in the title, the metadata and the body
 * — which is also why `src/routes/portfolio.real-weddings.$slug.tsx` builds its
 * canonical URL and breadcrumb from the same fields.
 */
export type Wedding = {
  slug: string;
  title: string;
  couple: string;
  /** The venue, named. This is the long-tail keyword. */
  venue: string;
  location: string;
  type: "Candid" | "Traditional" | "Church" | "Pre-wedding" | "Destination" | "Intimate";
  coverage: "Photography" | "Videography" | "Photography + Videography";
  season: string;
  cover: ImageKey;
  summary: string;
  story: string[];
  frames: ImageKey[];
  services: string[];
};

export const weddings: Wedding[] = [
  {
    slug: "calicut-church-wedding",
    title: "A Calicut Church Wedding",
    couple: "Nikhil & Amritha",
    venue: "St. Mary's Church, Kozhikode",
    location: "Kozhikode, Kerala",
    type: "Church",
    coverage: "Photography + Videography",
    season: "January",
    cover: "calicut-church-wedding-ceremony",
    summary:
      "Vows beneath stained glass in Calicut, followed by a courtyard reception lit by the last of the evening sun.",
    story: [
      "The morning began quietly — the family home in Kozhikode filling slowly with cousins, the bride's veil laid out across jasmine laid the night before.",
      "Inside the church the light fell in long coloured bars across the aisle. We photographed the ceremony without interrupting it: the ring, the blessing, the parents watching from the second pew.",
      "By evening the courtyard had turned gold, and the reception became a portrait session of everyone who had travelled to be there.",
    ],
    frames: [
      "calicut-church-wedding-ceremony",
      "church-golden-altar",
      "church-altar-candid",
      "church-outside-joy",
      "detail-bride-groom-feet",
      "portrait-bride-sunlight",
    ],
    services: ["Candid photography", "Traditional photography", "Cinematic wedding film"],
  },
  {
    slug: "wayanad-pre-wedding-story",
    title: "Mist & Tea Estates",
    couple: "Arjun & Divya",
    venue: "Wayanad tea estates",
    location: "Wayanad, Kerala",
    type: "Pre-wedding",
    coverage: "Photography + Videography",
    season: "August",
    cover: "hero-traditional-intimate",
    summary:
      "A sunrise pre-wedding shoot across Wayanad's tea estates, shot entirely in natural light and finished as a save-the-date.",
    story: [
      "We left Kozhikode before three in the morning to reach the estate before the mist lifted.",
      "For two hours the couple walked and talked while we worked at a distance — the frames that followed needed no direction at all.",
      "The film cut from this session became their save-the-date, scored to a single Malayalam guitar line.",
    ],
    frames: [
      "hero-traditional-intimate",
      "kerala-cinematic-wedding-film-still",
      "portrait-bride-sunlight",
      "ceremony-south-asian-prewedding",
      "instagram-01",
      "instagram-02",
    ],
    services: ["Pre-wedding photography", "Save-the-date film", "Drone cinematography"],
  },
  {
    slug: "malappuram-candid-wedding",
    title: "A House Full of Love",
    couple: "Fahad & Sneha",
    venue: "Traditional residence, Malappuram",
    location: "Malappuram, Kerala",
    type: "Candid",
    coverage: "Photography",
    season: "March",
    cover: "haldi-bride-with-friends",
    summary:
      "A traditional Malappuram wedding photographed candidly, from the henna evening to the send-off.",
    story: [
      "Three days, one house, and a family that never stopped moving.",
      "We covered the henna evening, the nikah and the send-off, staying close to the bride's sisters — the true narrators of the day.",
      "The final album reads like a documentary: unposed, warm, and impossible to reconstruct.",
    ],
    frames: [
      "haldi-bride-with-friends",
      "detail-bride-henna-face",
      "detail-bouquet",
      "ceremony-temple-ritual",
      "portrait-bride-sunlight",
      "detail-reception-monochrome",
    ],
    services: ["Candid photography", "Haldi & Mehendi photography", "Live screening"],
  },
  {
    slug: "kozhikode-beach-post-wedding",
    title: "Golden Hour by the Arabian Sea",
    couple: "Vivek & Anu",
    venue: "Kozhikode Beach",
    location: "Kozhikode, Kerala",
    type: "Destination",
    coverage: "Photography + Videography",
    season: "November",
    cover: "calicut-cinematic-wedding-hero",
    summary:
      "A post-wedding portrait session on Kozhikode beach, timed to the last twenty minutes of light.",
    story: [
      "Post-wedding sessions give us the one thing a wedding day never does — time.",
      "We waited for the light to drop below the horizon line and let the couple wander the shore.",
      "The result is quiet, cinematic, and entirely theirs.",
    ],
    frames: [
      "calicut-cinematic-wedding-hero",
      "home-hero-user",
      "hero-traditional-intimate",
      "kerala-cinematic-wedding-film-still",
      "detail-bride-groom-feet",
    ],
    services: ["Post-wedding photography", "Cinematic wedding film", "Drone shoot"],
  },
  {
    slug: "traditional-kerala-wedding",
    title: "Silk, Gold & Ritual",
    couple: "Hari & Lakshmi",
    venue: "Traditional ceremony, Kozhikode",
    location: "Kozhikode, Kerala",
    type: "Traditional",
    coverage: "Photography + Videography",
    season: "May",
    cover: "ceremony-temple-ritual",
    summary:
      "A complete traditional Kerala wedding — every ritual documented in sequence, every elder portrait made.",
    story: [
      "Traditional coverage is a discipline: nothing may be missed, and nothing may be rushed.",
      "We photographed each ritual in order and made formal portraits of every family group before the sadya.",
      "The archive runs to over two thousand frames; the album to eighty.",
    ],
    frames: [
      "ceremony-temple-ritual",
      "ceremony-south-asian-prewedding",
      "detail-bride-groom-feet",
      "detail-bride-henna-face",
      "detail-bouquet",
      "church-golden-altar",
    ],
    services: ["Traditional photography", "Candid photography", "Cinematic wedding film"],
  },
  {
    slug: "destination-wedding-aerials",
    title: "A Venue From Above",
    couple: "Ralph & Meera",
    venue: "Backwater resort, Alappuzha",
    location: "Alappuzha, Kerala",
    type: "Destination",
    coverage: "Photography + Videography",
    season: "December",
    cover: "detail-reception-monochrome",
    summary:
      "Destination coverage across coconut groves and backwater — a team on the ground and a drone over the venue.",
    story: [
      "Some venues can only be understood from the air.",
      "We opened the film with a single rising shot over the venue before the first cut.",
      "On the ground, two photographers and two cinematographers covered three simultaneous events without anyone noticing a second team.",
    ],
    frames: [
      "detail-reception-monochrome",
      "detail-reception-cake",
      "closing-cta-user",
      "church-altar-candid",
      "home-hero-user",
    ],
    services: ["Drone shoots", "Cinematic wedding film", "Candid photography"],
  },
];

/**
 * "Church wedding photography", "Pre-wedding photography" — the phrase the
 * search query actually takes.
 *
 * The type doubles as the first word of the title, but "Pre-wedding" is already
 * the whole service name, so the template needs a branch or it reads
 * "Pre-wedding Wedding Photography".
 */
export const serviceLabel = (type: Wedding["type"]) =>
  type === "Pre-wedding" ? "Pre-wedding photography" : `${type} wedding photography`;

/**
 * "St. Mary's Church, Kozhikode, Kerala" — the venue and its locality, with the
 * town written once.
 *
 * Venues are named after the town they are in, so naively joining `venue` and
 * `location` produces "St. Mary's Church, Kozhikode, Kozhikode, Kerala" in every
 * title tag. The town is dropped from the locality when the venue already says
 * it, which is the case for all six stories.
 */
export const place = (venue: string, location: string) => {
  const [town, ...region] = location.split(",").map((part) => part.trim());
  return town && venue.includes(town)
    ? [venue, ...region].join(", ")
    : [venue, location].join(", ");
};

export const findWedding = (slug: string) => weddings.find((w) => w.slug === slug);
