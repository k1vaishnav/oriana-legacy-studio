/**
 * One-time CMS bootstrap: preloads Sanity with the site's current content.
 *
 * Run AFTER creating the project + dataset and generating an Editor token:
 *
 *   SANITY_API_TOKEN=<editor-token> npm run cms:seed
 *
 * Project/dataset resolve from SANITY_PROJECT_ID / SANITY_DATASET (or the
 * VITE_SANITY_* equivalents in `.env`). Everything uses `createOrReplace`,
 * so re-running is safe — it rewrites, never duplicates. Afterwards the
 * Studio at `/studio` shows the real copy, editable page by page.
 *
 * Images: the 30 archive frames are uploaded once as Sanity assets (skipped
 * when an asset with the same filename already exists) and every image slot
 * in the documents below is wired to its asset — so each photo arrives in the
 * Studio pre-filled AND fully CRUD-able (replace, remove, reorder, upload
 * new). Docs below keep readable archive keys; the transform before upload
 * converts them to asset references.
 */
import { createClient } from "@sanity/client";
import { createReadStream, readFileSync } from "node:fs";

const projectId = process.env.SANITY_PROJECT_ID ?? process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? process.env.VITE_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) throw new Error("Set SANITY_PROJECT_ID (or VITE_SANITY_PROJECT_ID).");
if (!token) throw new Error("Set SANITY_API_TOKEN (Editor role, from sanity.io/manage).");

const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token });

/* ------------------------------------------------------------------ */
/* Photo assets: upload once, reference everywhere                      */
/* ------------------------------------------------------------------ */

const manifest = JSON.parse(readFileSync("src/lib/images.json", "utf8"));

// Largest generated derivative per archive key — the best upload source.
const largestFile = (key) => {
  const widths = manifest[key]?.widths ?? [];
  const max = widths[widths.length - 1];
  return `public/img/${key}-${max}.jpg`;
};

const imageRef = (ref) => ({ _type: "image", asset: { _type: "reference", _ref: ref } });

// Upload the 30 frames unless an asset with the same filename already exists
// (idempotent: re-running never duplicates assets).
const existingAssets = await client.fetch(
  `*[_type == "sanity.imageAsset"]{ _id, originalFilename }`,
);
const assetIdByFile = new Map((existingAssets ?? []).map((a) => [a.originalFilename, a._id]));
const refByKey = {};
for (const key of Object.keys(manifest).sort()) {
  const filename = `${key}.jpg`;
  let id = assetIdByFile.get(filename);
  if (!id) {
    const file = largestFile(key);
    console.log(`upload ${key} ← ${file}`);
    const uploaded = await client.assets.upload("image", createReadStream(file), { filename });
    id = uploaded._id;
  }
  refByKey[key] = id;
}
console.log(`assets ready (${Object.keys(refByKey).length} frames)`);

const img = (key) => imageRef(refByKey[key]);
const imgs = (keys) => keys.map(img);

// The portfolio wall in wall order, with the registry captions and the
// filters each frame belongs to (mirrors the built-in filter groups).
const LIBRARY = [
  ["home-hero-user", "Newlywed couple sharing a quiet moment, photographed by Oriana Weddings", []],
  [
    "hero-traditional-intimate",
    "Bride and groom together in wedding attire, photographed by Oriana Weddings",
    ["candid", "intimate"],
  ],
  [
    "calicut-cinematic-wedding-hero",
    "Bride in a red veil at night, photographed by Oriana Weddings",
    ["candid"],
  ],
  [
    "kerala-cinematic-wedding-film-still",
    "Bride celebrating with sparklers among loved ones, photographed by Oriana Weddings",
    ["candid"],
  ],
  [
    "calicut-church-wedding-ceremony",
    "Wedding ceremony with family and friends, photographed by Oriana Weddings",
    ["traditional", "christian"],
  ],
  [
    "church-golden-altar",
    "Bride in a gold veil and temple jewellery, photographed by Oriana Weddings",
    ["traditional", "christian"],
  ],
  [
    "portrait-bride-sunlight",
    "Kerala bride in gold jewellery at a doorway, photographed by Oriana Weddings",
    ["candid", "intimate", "haldi", "pre"],
  ],
  ["closing-cta-user", "Newlywed couple at home, photographed by Oriana Weddings", ["venue"]],
  [
    "ceremony-temple-ritual",
    "Bride in red and gold jewellery, photographed by Oriana Weddings",
    ["traditional"],
  ],
  [
    "ceremony-south-asian-prewedding",
    "Newlywed couple sharing a quiet moment outdoors, photographed by Oriana Weddings",
    ["traditional"],
  ],
  [
    "church-altar-candid",
    "Veiled bride with the groom, photographed by Oriana Weddings",
    ["traditional", "christian", "venue"],
  ],
  [
    "church-outside-joy",
    "Newlywed couple laughing together outdoors, photographed by Oriana Weddings",
    ["traditional", "christian"],
  ],
  [
    "haldi-bride-with-friends",
    "Bride and groom in vibrant wedding attire, photographed by Oriana Weddings",
    ["candid", "intimate", "traditional", "haldi", "pre"],
  ],
  [
    "detail-bride-henna-face",
    "Bride during the haldi ceremony, photographed by Oriana Weddings",
    ["traditional", "haldi", "pre", "venue"],
  ],
  [
    "detail-bouquet",
    "Wedding bouquet detail, photographed by Oriana Weddings",
    ["haldi", "pre", "venue"],
  ],
  [
    "detail-bride-groom-feet",
    "Couple dancing at their wedding, photographed by Oriana Weddings",
    [],
  ],
  [
    "detail-reception-cake",
    "Wedding reception details, photographed by Oriana Weddings",
    ["venue"],
  ],
  [
    "detail-reception-monochrome",
    "Newlywed couple in a quiet moment at home, photographed by Oriana Weddings",
    ["candid", "intimate", "venue"],
  ],
  ["instagram-01", "Wedding moment, photographed by Oriana Weddings", ["candid", "pre"]],
  ["instagram-02", "Wedding moment, photographed by Oriana Weddings", ["candid", "pre"]],
  ["instagram-07", "Wedding moment, photographed by Oriana Weddings", ["candid", "pre"]],
  ["instagram-08", "Wedding moment, photographed by Oriana Weddings", ["candid", "pre"]],
  ["instagram-03", "Wedding moment, photographed by Oriana Weddings", []],
  ["instagram-04", "Wedding moment, photographed by Oriana Weddings", []],
  ["instagram-05", "Wedding moment, photographed by Oriana Weddings", []],
  ["instagram-06", "Wedding moment, photographed by Oriana Weddings", []],
  ["instagram-09", "Wedding moment, photographed by Oriana Weddings", []],
  ["instagram-10", "Wedding moment, photographed by Oriana Weddings", []],
  ["instagram-11", "Wedding moment, photographed by Oriana Weddings", []],
  ["instagram-12", "Wedding moment, photographed by Oriana Weddings", []],
];

/**
 * Docs below keep readable archive keys (`coverKey`, `frameKeys`, …); this
 * converts them to image-asset references before upload, so the source stays
 * reviewable while Sanity gets real CRUD-able photographs. Unknown keys fall
 * back to no image rather than a broken reference.
 */
const toImageFields = (doc) => {
  const out = { ...doc };
  const single = (from, to) => {
    if (typeof out[from] === "string") {
      if (refByKey[out[from]]) out[to] = img(out[from]);
      delete out[from];
    }
  };
  const plural = (from, to) => {
    if (Array.isArray(out[from])) {
      out[to] = out[from].filter((k) => refByKey[k]).map(img);
      delete out[from];
    }
  };
  single("coverKey", "cover");
  single("heroImageKey", "heroImage");
  plural("galleryKeys", "gallery");
  plural("frameKeys", "frames");
  plural("mosaicKeys", "mosaic");
  plural("filmCoverKeys", "filmCovers");
  if (out.closingCta && typeof out.closingCta.imageKey === "string") {
    out.closingCta = { ...out.closingCta };
    if (refByKey[out.closingCta.imageKey]) out.closingCta.image = img(out.closingCta.imageKey);
    delete out.closingCta.imageKey;
  }
  // Soul poster defaults to the built-in still so the field never sits blank.
  if (out.soulCinema && !out.soulCinema.poster) {
    out.soulCinema = { ...out.soulCinema, poster: img("kerala-cinematic-wedding-film-still") };
  }
  if (Array.isArray(out.collections)) {
    out.collections = out.collections.map((c) => {
      const next = { ...c };
      if (typeof next.imageKey === "string" && refByKey[next.imageKey]) {
        next.image = img(next.imageKey);
      }
      delete next.imageKey;
      return next;
    });
  }
  if (Array.isArray(out.teamMembers)) {
    out.teamMembers = out.teamMembers.map((m) => {
      const next = { ...m };
      if (typeof next.imageKey === "string" && refByKey[next.imageKey]) {
        next.image = img(next.imageKey);
      }
      delete next.imageKey;
      return next;
    });
  }
  if (out._id === "portfolioPage") {
    out.library = LIBRARY.map(([key, caption, categories]) => ({
      photo: img(key),
      caption,
      categories,
    }));
  }
  return out;
};

/**
 * Sanity requires every OBJECT inside an array to carry a `_key` — without
 * one the Studio shows "Missing keys" and locks the list for editing. (Plain
 * strings/numbers in arrays are fine.) This walks each document and stamps any
 * key-less array item, so the seed output is always Studio-ready. Keys are
 * deterministic per run; re-seeding replaces whole documents anyway.
 */
let keyCounter = 0;
const assignKeys = (node) => {
  if (Array.isArray(node)) {
    return node.map((item) => {
      if (item && typeof item === "object") {
        const keyed = item._key ? { ...item } : { _key: `seed-${++keyCounter}`, ...item };
        for (const k of Object.keys(keyed)) keyed[k] = assignKeys(keyed[k]);
        return keyed;
      }
      return item;
    });
  }
  if (node && typeof node === "object") {
    const out = { ...node };
    for (const k of Object.keys(out)) out[k] = assignKeys(out[k]);
    return out;
  }
  return node;
};

const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    phone: "+91 96055 75311",
    phoneHref: "tel:+919605575311",
    whatsapp: "919605575311",
    email: "orianaweddings@gmail.com",
    instagram: "https://www.instagram.com/orianaweddings/",
    youtube: "https://www.youtube.com/@orianaweddings",
    facebook: "https://www.facebook.com/orianaweddings",
    establishedYear: 1996,
    brandLines: ["Indian Wedding Film Award Winner", "Couple Choice Award Winner"],
    offices: [
      {
        city: "Calicut, Kerala",
        role: "Main office and the home of Oriana Weddings",
        street: "1st Floor, Marine Building, Cherooty Road",
        postcode: "Kozhikode 673001",
        phone: "+91 96055 75311",
        phoneHref: "tel:+919605575311",
        secondPhone: "+91 96055 75330",
        secondPhoneHref: "tel:+919605575330",
      },
      {
        city: "Ahmedabad, Gujarat",
        role: "Our Gujarat office",
        street: "Law Garden",
        postcode: "Ahmedabad",
        phone: "+91 96055 75311",
        phoneHref: "tel:+919605575311",
        secondPhone: "+91 96055 75330",
        secondPhoneHref: "tel:+919605575330",
      },
    ],
    coverage: [
      "Kozhikode / Calicut",
      "Malappuram",
      "Wayanad",
      "Kerala",
      "Ahmedabad",
      "Gujarat",
      "Chennai",
      "Mumbai",
      "India",
      "International destinations",
    ],
    stats: [
      { value: "12+", label: "Years managing weddings" },
      { value: "100%", label: "Oriana management" },
      { value: "02", label: "Offices — Calicut & Ahmedabad" },
      { value: "04", label: "Kerala · Gujarat · India · Beyond" },
    ],
    soulCinema: {
      title: "Soul + Cinema",
      body: "Every wedding is unique and so are our films. For the past 12 years, Oriana has set new benchmarks of storytelling within the wedding realm and beyond. We are fortunate to have experienced such unique cultures and traditions across Kerala, Gujarat, India and beyond, and to document stories that continuously overwhelm us.",
      videoSrc: "/video/soul-cinema-stock.mp4",
    },
    closingCta: {
      kicker: "ORIANAWEDDINGS · WEDDING PHOTOGRAPHY & FILMS",
      heading: "A day, held forever.",
      button: "Enquire on WhatsApp",
      imageKey: "closing-cta-user",
    },
    chatbot: {
      greeting: "Hi there! 👋 Welcome to Oriana Weddings.",
      prompt: "Ask me anything — or share your name and I’ll get you a quick quote.",
      handoff: "Perfect! Opening WhatsApp so our team can assist you right away. 💬",
    },
    footerExplore: "Explore",
    footerStudios: "Studio",
    footerCoverage: "Where we shoot",
    affiliations: [
      { name: "WeddingSutra", href: "https://www.weddingsutra.com/" },
      { name: "Vogue", href: "https://www.vogue.in/" },
      { name: "Hindustan Times", href: "https://www.hindustantimes.com/" },
      { name: "India Film Project", href: "https://ifp.world/" },
      { name: "The Times of India", href: "https://timesofindia.indiatimes.com/" },
      { name: "Asian Photography", href: "https://asianphotographyindia.com/" },
      { name: "Femina India Wedding Show", href: "https://www.femina.in/" },
      { name: "Diva", href: "https://www.divaplanetmagazine.com/" },
      { name: "Sabyasachi", href: "https://www.sabyasachi.com" },
      { name: "Condé Nast Traveler", href: "https://www.cntraveller.in/" },
      { name: "Wedding Vows", href: "https://www.weddingvows.com/" },
      { name: "Cultured Wedding Magazine", href: "https://www.instagram.com/culturedwedding/" },
      { name: "Manish Malhotra", href: "https://www.manishmalhotra.in" },
      { name: "Vera Wang", href: "https://www.verawang.com" },
    ],
    notFound: {
      eyebrow: "404",
      title: "This page has moved on.",
      body: "The page you are looking for doesn’t exist. Browse our wedding stories, or start a conversation with the studio.",
      primaryLabel: "View portfolio",
      secondaryLabel: "Go home",
    },
    errorPage: {
      eyebrow: "Error",
      title: "This page didn’t load",
      body: "Something went wrong on our end. Try again, or head back home.",
      primaryLabel: "Try again",
      secondaryLabel: "Go home",
    },
  },
  {
    _id: "homePage",
    _type: "homePage",
    seoTitle: "Best Photographer in Calicut | Best Photographer in Kerala | Oriana Weddings",
    seoDescription:
      "Oriana Weddings is a 12+ year wedding photography and filmmaking brand based in Calicut and Ahmedabad, managing personalised weddings across Kerala, Gujarat, India and international destinations.",
    heroImageKey: "home-hero-user",
    heroEyebrow: "Oriana Weddings · Photography & Films",
    heroTitle: "Your wedding, our responsibility.",
    heroSub: "Candid, traditional & cinematic — managed by Oriana.",
    heroPrimaryLabel: "View our work",
    heroSecondaryLabel: "Enquire",
    introEyebrow: "ORIANAWEDDINGS · PHOTOGRAPHY & CINEMA",
    introHeading: "Every story has its own rhythm.",
    introBody: "We hold on to the rituals, the in-between moments, and the joy.",
    collections: [
      { id: "candid", title: "Candid", imageKey: "portrait-bride-sunlight" },
      { id: "traditional", title: "Traditional", imageKey: "ceremony-temple-ritual" },
      { id: "intimate", title: "Intimate", imageKey: "hero-traditional-intimate" },
      { id: "pre", title: "Pre-wedding", imageKey: "haldi-bride-with-friends" },
    ],
    mosaicLines: ["Some of the most", "ICONIC", "wedding images"],
    mosaicKeys: [
      "home-hero-user",
      "hero-traditional-intimate",
      "calicut-cinematic-wedding-hero",
      "kerala-cinematic-wedding-film-still",
      "calicut-church-wedding-ceremony",
      "church-golden-altar",
      "portrait-bride-sunlight",
      "closing-cta-user",
      "ceremony-temple-ritual",
      "ceremony-south-asian-prewedding",
      "church-altar-candid",
      "church-outside-joy",
      "haldi-bride-with-friends",
      "detail-bride-henna-face",
    ],
    filmsEyebrow: "WEDDING FILMS",
    filmsTitle: "Stories, in motion.",
    filmCoverKeys: [
      "home-hero-user",
      "hero-traditional-intimate",
      "portrait-bride-sunlight",
      "ceremony-temple-ritual",
      "haldi-bride-with-friends",
      "detail-bouquet",
    ],
    awardsEyebrow: "DECADE OF EXCELLENCE",
    awardsTitle: "Awards & Accolades",
    awardsBadges: [
      { subtitle: "FINALIST", title: "LOS ANGELES FILM FESTIVAL", year: "2020" },
      {
        subtitle: "WINNER",
        title: "WEDDING FILMMAKER OF THE YEAR",
        year: "2020, 2019, 2018",
        organization: "WEDDINGSUTRA",
      },
      {
        subtitle: "PLATINUM",
        title: "PLATINUM FILM OF THE YEAR",
        year: "2017",
        organization: "INDIA FILM PROJECT",
      },
      {
        subtitle: "WINNER",
        title: "WEDDING INFLUENCERS OF THE YEAR",
        year: "2018",
        organization: "WEDDINGSUTRA",
      },
      {
        subtitle: "TOP HONOURS",
        title: "BEST DESTINATION STUDIO",
        year: "2023",
        organization: "COUPLES' CHOICE",
      },
    ],
    gearCamerasLabel: "Camera systems",
    gearPostLabel: "Post production",
  },
  {
    _id: "aboutPage",
    _type: "aboutPage",
    seoTitle: "About Oriana Weddings | Best Photographer in Calicut | Best Photographer in Kerala",
    seoDescription:
      "Discover Oriana Weddings, a 12+ year wedding photography and filmmaking brand based in Calicut and Ahmedabad, managing weddings across Kerala, Gujarat, India and beyond.",
    heroImageKey: "calicut-church-wedding-ceremony",
    heroImageAlt: "Wedding ceremony with family and friends, photographed by Oriana Weddings",
    heroEyebrow: "About Oriana",
    heroTitle: "More than wedding photographers",
    heroLead:
      "Oriana Weddings has grown beyond the traditional idea of a wedding photography company. It is a photography and filmmaking brand built around experience, team selection, planning, management and trust.",
    heroMeta: [
      { label: "Founded", value: "12+ years experience" },
      { label: "Main office", value: "Calicut, Kerala" },
    ],
    teamEyebrow: "The team",
    teamHeading: "Meet the team",
    teamBody:
      "The people you are trusting with a day that cannot be repeated. You meet them before the wedding, and the same team photographs it.",
    teamMembers: [
      { name: "Delwin Joseph", role: "Founder & Director", imageKey: "portrait-bride-sunlight" },
      { name: "Fathima Abdul Samad", role: "Photography", imageKey: "detail-bride-henna-face" },
      {
        name: "Ravi Malhotra",
        role: "Film & Cinematography",
        imageKey: "kerala-cinematic-wedding-film-still",
      },
      { name: "Vinesh Pandian", role: "Post-Production", imageKey: "detail-reception-monochrome" },
    ],
    rightEyebrow: "The right team for the right wedding",
    rightTitle: "We don't believe one photographer is right for every couple.",
    rightLead:
      "Every photographer has a different visual language, personality, technical ability and experience. We understand the client first. Then we select the team.",
    rightBody:
      "Oriana retains the professional decision-making responsibility for selecting the photography and filmmaking team. That is not a way of avoiding accountability — it is how we take responsibility for the result.",
    differenceEyebrow: "Why we retain selection",
    differenceTitle: "The decision stays with Oriana, on purpose",
    differenceLead:
      "A photographer's old work is evidence of what they have done. It is not evidence of what they are best suited to do for your wedding today.",
    differenceCards: [
      {
        title: "You Choose Oriana. We Choose the Right Team.",
        body: "A photographer's portfolio shows what they have photographed before. Your wedding is happening today. After 12+ years, our in-house team understands the photographers and filmmakers we work with — their strengths, working styles, technical knowledge, character, language proficiency and suitability.",
      },
      {
        title: "The Team Is Built Around Your Wedding",
        body: "Style, scale, culture, language and the output you are expecting all decide who is on the day. A Keralite Hindu wedding and a Calicut church wedding are not the same assignment, and we do not staff them as if they were.",
      },
      {
        title: "100% Oriana Management",
        body: "You communicate with Oriana. Oriana manages the team. The team captures the wedding. Oriana takes responsibility for the agreed output.",
      },
      {
        title: "After the Wedding, You Still Deal With Oriana",
        body: "The photographer's assigned role ends at capture and submission. Post-production and final delivery stay with Oriana.",
      },
      {
        title: "We Don't Impose Our Style",
        body: "You already know what you like. Bring references. We respect them instead of forcing one Oriana look onto every couple.",
      },
      {
        title: "Your Wedding Is Not Content",
        body: "Some weddings are meant to stay private. Confidential, privacy-focused coverage is available on request.",
      },
    ],
    marqueeItems: [
      "12+ years",
      "Two studios",
      "Kerala",
      "Gujarat",
      "India",
      "Worldwide",
      "In-house team",
      "One point of contact",
      "Destination shoots",
      "Confidential coverage",
    ],
    placesEyebrow: "Offices & coverage",
    placesTitle: "Two offices, and everywhere else we can reach",
    placesLead:
      "Our main office is in Calicut, Kerala. Our Gujarat office is in Law Garden, Ahmedabad. With strong wedding heritage in both states, we work across India and undertake destination and international shoots.",
  },
  {
    _id: "brandsPage",
    _type: "brandsPage",
    seoTitle: "Our Brands | Oriana Weddings | Creative Brands",
    seoDescription:
      "Meet the creative brands of Oriana — Oriana Weddings, Baby Crew Studios, DEOR Fashion, ORION Events and Odonata Republic.",
    heroImageKey: "detail-reception-monochrome",
    heroImageAlt: "Newlywed couple in a quiet moment at home, photographed by Oriana Weddings",
    heroEyebrow: "Our brands",
    heroTitle: "Five brands, one house",
    heroLead:
      "Oriana Group brings together creative brands working across photography, fashion, events and luxury products.",
    metaFirstLabel: "Brands",
    metaSecondLabel: "Offices",
    metaSecondValue: "Calicut & Ahmedabad",
    backLabel: "← All brands",
    whyEyebrow: "Why more than one brand",
    whyTitle: "Different work needs different people, but the same standard",
    whyLead:
      "A wedding, a newborn, a fashion campaign and a 500-guest event are not the same craft. Keeping them in one group means each brand can specialise without reinventing how the business is managed.",
    approachEyebrow: "The shared approach",
    approachTitle: "What every brand in the group does the same way",
    approachCards: [
      {
        title: "In-house management",
        body: "The brands are run, not merely branded. The management decisions that affect your work are made by the group rather than outsourced to whoever is free.",
      },
      {
        title: "One point of contact",
        body: "Whoever you deal with stays your contact through delivery. The group does not pass you between brands because the enquiry was easier that way.",
      },
      {
        title: "Selected professionals",
        body: "The same selection principle that runs Oriana Weddings runs across the group: match the professional to the work, and keep the decision with the studio.",
      },
      {
        title: "Quality management",
        body: "The work is reviewed against the brief before delivery, on our side, every time.",
      },
      {
        title: "Written terms",
        body: "Scope, deliverables and payment terms are agreed in writing before work begins, on every brand.",
      },
      {
        title: "Privacy respected",
        body: "Confidential coverage is available, and nothing is published or shared without permission.",
      },
    ],
  },
  {
    _id: "contactPage",
    _type: "contactPage",
    seoTitle:
      "Contact the Best Photographer in Calicut | Contact the Best Photographer in Kerala | Oriana Weddings",
    seoDescription:
      "Contact Oriana Weddings for wedding photography, videography and cinematic wedding films in Calicut, Kerala, Ahmedabad, Gujarat, India and destination locations.",
    eyebrow: "Contact",
    heading: "Tell us the date. We will tell you the rest.",
    lead: "Write what you know and leave the rest blank. We read every enquiry ourselves and reply the same day, usually the same evening.",
    serviceOptions: [
      { value: "Photography", note: "Candid, traditional, destination" },
      { value: "Wedding Films", note: "Feature films, teasers, reels" },
      { value: "Photography + Films", note: "Both teams, structured together" },
    ],
    formEyebrow: "Enquiry",
    formTitle: "Five boxes. That is the whole form.",
    formBody:
      "We only ask for what we need to answer you. Dates, venue and everything else can wait for the reply.",
    sentEyebrow: "Sent",
    sentTitle: "Thank you — we have your details.",
    sentBody:
      "Oriana will reply to you shortly, usually the same day. If it is urgent, call {phone}.",
    blockedTitle: "One tap left.",
    blockedBody:
      "Your browser stopped the WhatsApp window from opening on its own, so this has not been sent yet. Nothing you typed is lost — press the button and it goes.",
    blockedButton: "Open WhatsApp",
    nextSteps: [
      {
        title: "We read it ourselves",
        body: "Your enquiry goes to the studio, not to a form inbox that nobody opens until Monday.",
      },
      {
        title: "We reply with a plan",
        body: "You get an honest answer about whether we are the right studio for your date — including when we are not.",
      },
      {
        title: "Nothing is locked in",
        body: "No payment to begin a conversation. We send a proposal you can read properly before you decide anything.",
      },
    ],
    stepsEyebrow: "What happens next",
    asideEyebrow: "Faster than the form",
    asideTitle: "Message us on WhatsApp.",
    asideBody:
      "One message is enough — send the date, or a voice note, or nothing more than “are you free in February”. We read them ourselves.",
    asideButton: "Open WhatsApp",
    asideCallLabel: "Or call the studio",
    whereEyebrow: "Where we are",
    whereTitle: "Two offices. One studio, whichever one you visit.",
    pinnedCall: "Call",
    pinnedWhatsapp: "WhatsApp",
  },
  {
    _id: "filmsPage",
    _type: "filmsPage",
    seoTitle: "Wedding Films | Oriana Weddings",
    seoDescription:
      "Watch wedding films, teasers, highlights and storytelling films by Oriana Weddings.",
  },
  {
    _id: "photographyPage",
    _type: "photographyPage",
    seoTitle: "Wedding Photography Stories | Oriana Weddings",
    seoDescription: "A collection of wedding photography stories from Oriana Weddings.",
  },
  {
    _id: "portfolioPage",
    _type: "portfolioPage",
    seoTitle: "Wedding Photography Portfolio | Oriana Weddings",
    seoDescription:
      "Browse wedding photographs by Oriana Weddings. Explore candid, traditional, intimate, pre-wedding and other photography styles.",
    eyebrow: "ORIANA WEDDINGS · PORTFOLIO",
    sub: "A few moments, held in still frames.",
    storyBackLabel: "← All stories",
    storiesBackLabel: "← All photography stories",
    countTemplate: "Showing {shown} of {total} images",
    showMoreTemplate: "Show more ({remaining} remaining)",
    filterLabels: [
      { id: "all", label: "All work" },
      { id: "candid", label: "Candid" },
      { id: "traditional", label: "Traditional" },
      { id: "intimate", label: "Intimate" },
      { id: "haldi", label: "Haldi & Mehendi" },
      { id: "christian", label: "Christian" },
      { id: "pre", label: "Pre-wedding" },
      { id: "venue", label: "Venues" },
    ],
  },
  {
    _id: "brand-oriana-weddings",
    _type: "brand",
    name: "Oriana Weddings",
    slug: { current: "oriana-weddings" },
    order: 0,
    tagline: "Wedding photography and cinematic films.",
    description:
      "Wedding photography and cinematic films — candid, traditional, intimate, pre-wedding, post-wedding, destination and confidential wedding coverage. Managed by Oriana.",
    audience: "Couples planning a wedding in Kerala, Gujarat, India or abroad.",
    offerings: [
      "Candid and traditional wedding photography",
      "Intimate, pre-wedding and post-wedding sessions",
      "Cinematic wedding films, teasers and highlights",
      "Destination and confidential wedding coverage",
    ],
    coverKey: "home-hero-user",
    galleryKeys: [
      "home-hero-user",
      "hero-traditional-intimate",
      "calicut-church-wedding-ceremony",
      "portrait-bride-sunlight",
    ],
  },
  {
    _id: "brand-baby-crew-studios",
    _type: "brand",
    name: "Baby Crew Studios",
    slug: { current: "baby-crew-studios" },
    order: 1,
    tagline: "Baby photography and related creative services.",
    description:
      "Baby photography and related creative services — newborn, baby and family portraiture.",
    audience: "Parents with newborns, babies and young children.",
    offerings: ["Newborn photography", "Baby and milestone sessions", "Family portraiture"],
    coverKey: "haldi-bride-with-friends",
    galleryKeys: [
      "haldi-bride-with-friends",
      "detail-bouquet",
      "portrait-bride-sunlight",
      "instagram-03",
    ],
  },
  {
    _id: "brand-deor-fashion",
    _type: "brand",
    name: "DEOR Fashion",
    slug: { current: "deor-fashion" },
    order: 2,
    tagline: "Fashion photography and fashion-related creative work.",
    description:
      "Fashion photography and fashion-related creative work — editorial, lookbook and campaign photography.",
    audience: "Fashion labels, designers and brands needing editorial or campaign work.",
    offerings: ["Editorial photography", "Lookbook shoots", "Campaign photography"],
    coverKey: "detail-reception-monochrome",
    galleryKeys: [
      "detail-reception-monochrome",
      "calicut-cinematic-wedding-hero",
      "instagram-07",
      "instagram-08",
    ],
  },
  {
    _id: "brand-orion-events",
    _type: "brand",
    name: "ORION Events",
    slug: { current: "orion-events" },
    order: 3,
    tagline: "Wedding and corporate event services.",
    description:
      "Wedding and corporate event services — event design, coordination and on-ground production.",
    audience: "Families and companies needing event design, coordination and production.",
    offerings: ["Event design", "Wedding and corporate coordination", "On-ground production"],
    coverKey: "detail-reception-cake",
    galleryKeys: [
      "detail-reception-cake",
      "closing-cta-user",
      "church-altar-candid",
      "instagram-05",
    ],
  },
  {
    _id: "brand-odonata-republic",
    _type: "brand",
    name: "Odonata Republic",
    slug: { current: "odonata-republic" },
    order: 4,
    tagline: "Fashion and luxury products.",
    description:
      "Fashion and luxury products — specialty collections, handcrafted albums and fine-art prints.",
    audience: "Collectors and interior owners looking for specialty albums and fine-art prints.",
    offerings: ["Specialty collections", "Handcrafted wedding albums", "Fine-art prints"],
    coverKey: "detail-bouquet",
    galleryKeys: [
      "detail-bouquet",
      "detail-bride-groom-feet",
      "detail-reception-monochrome",
      "instagram-11",
    ],
  },
  {
    _id: "wedding-calicut-church-wedding",
    _type: "wedding",
    title: "A Calicut Church Wedding",
    slug: { current: "calicut-church-wedding" },
    order: 0,
    couple: "Nikhil & Amritha",
    venue: "St. Mary's Church, Kozhikode",
    location: "Kozhikode, Kerala",
    type: "Church",
    coverKey: "calicut-church-wedding-ceremony",
    summary:
      "Vows beneath stained glass in Calicut, followed by a courtyard reception lit by the last of the evening sun.",
    story: [
      "The morning began quietly — the family home in Kozhikode filling slowly with cousins, the bride's veil laid out across jasmine laid the night before.",
      "Inside the church the light fell in long coloured bars across the aisle. We photographed the ceremony without interrupting it: the ring, the blessing, the parents watching from the second pew.",
      "By evening the courtyard had turned gold, and the reception became a portrait session of everyone who had travelled to be there.",
    ],
    frameKeys: [
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
    _id: "wedding-wayanad-pre-wedding-story",
    _type: "wedding",
    title: "Mist & Tea Estates",
    slug: { current: "wayanad-pre-wedding-story" },
    order: 1,
    couple: "Arjun & Divya",
    venue: "Wayanad tea estates",
    location: "Wayanad, Kerala",
    type: "Pre-wedding",
    coverKey: "hero-traditional-intimate",
    summary:
      "A sunrise pre-wedding shoot across Wayanad's tea estates, shot entirely in natural light and finished as a save-the-date.",
    story: [
      "We left Kozhikode before three in the morning to reach the estate before the mist lifted.",
      "For two hours the couple walked and talked while we worked at a distance — the frames that followed needed no direction at all.",
      "The film cut from this session became their save-the-date, scored to a single Malayalam guitar line.",
    ],
    frameKeys: [
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
    _id: "wedding-malappuram-candid-wedding",
    _type: "wedding",
    title: "A House Full of Love",
    slug: { current: "malappuram-candid-wedding" },
    order: 2,
    couple: "Fahad & Sneha",
    venue: "Traditional residence, Malappuram",
    location: "Malappuram, Kerala",
    type: "Candid",
    coverKey: "haldi-bride-with-friends",
    summary:
      "A traditional Malappuram wedding photographed candidly, from the henna evening to the send-off.",
    story: [
      "Three days, one house, and a family that never stopped moving.",
      "We covered the henna evening, the nikah and the send-off, staying close to the bride's sisters — the true narrators of the day.",
      "The final album reads like a documentary: unposed, warm, and impossible to reconstruct.",
    ],
    frameKeys: [
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
    _id: "wedding-kozhikode-beach-post-wedding",
    _type: "wedding",
    title: "Golden Hour by the Arabian Sea",
    slug: { current: "kozhikode-beach-post-wedding" },
    order: 3,
    couple: "Vivek & Anu",
    venue: "Kozhikode Beach",
    location: "Kozhikode, Kerala",
    type: "Destination",
    coverKey: "calicut-cinematic-wedding-hero",
    summary:
      "A post-wedding portrait session on Kozhikode beach, timed to the last twenty minutes of light.",
    story: [
      "Post-wedding sessions give us the one thing a wedding day never does — time.",
      "We waited for the light to drop below the horizon line and let the couple wander the shore.",
      "The result is quiet, cinematic, and entirely theirs.",
    ],
    frameKeys: [
      "calicut-cinematic-wedding-hero",
      "home-hero-user",
      "hero-traditional-intimate",
      "kerala-cinematic-wedding-film-still",
      "detail-bride-groom-feet",
    ],
    services: ["Post-wedding photography", "Cinematic wedding film", "Drone shoot"],
  },
  {
    _id: "wedding-traditional-kerala-wedding",
    _type: "wedding",
    title: "Silk, Gold & Ritual",
    slug: { current: "traditional-kerala-wedding" },
    order: 4,
    couple: "Hari & Lakshmi",
    venue: "Traditional ceremony, Kozhikode",
    location: "Kozhikode, Kerala",
    type: "Traditional",
    coverKey: "ceremony-temple-ritual",
    summary:
      "A complete traditional Kerala wedding — every ritual documented in sequence, every elder portrait made.",
    story: [
      "Traditional coverage is a discipline: nothing may be missed, and nothing may be rushed.",
      "We photographed each ritual in order and made formal portraits of every family group before the sadya.",
      "The archive runs to over two thousand frames; the album to eighty.",
    ],
    frameKeys: [
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
    _id: "wedding-destination-wedding-aerials",
    _type: "wedding",
    title: "A Venue From Above",
    slug: { current: "destination-wedding-aerials" },
    order: 5,
    couple: "Ralph & Meera",
    venue: "Backwater resort, Alappuzha",
    location: "Alappuzha, Kerala",
    type: "Destination",
    coverKey: "detail-reception-monochrome",
    summary:
      "Destination coverage across coconut groves and backwater — a team on the ground and a drone over the venue.",
    story: [
      "Some venues can only be understood from the air.",
      "We opened the film with a single rising shot over the venue before the first cut.",
      "On the ground, two photographers and two cinematographers covered three simultaneous events without anyone noticing a second team.",
    ],
    frameKeys: [
      "detail-reception-monochrome",
      "detail-reception-cake",
      "closing-cta-user",
      "church-altar-candid",
      "home-hero-user",
    ],
    services: ["Drone shoots", "Cinematic wedding film", "Candid photography"],
  },
  {
    _id: "film-the-wedding-film",
    _type: "film",
    title: "The Wedding Film",
    slug: { current: "the-wedding-film" },
    order: 0,
    location: "Kozhikode, Kerala",
    duration: "Feature · 12–20 min",
    description:
      "The full narrative of the day, edited as cinema — your voices, your vows, your people. This is the film the family gathers around.",
    youtubeId: "35c2JPyf90I",
  },
  {
    _id: "film-the-teaser",
    _type: "film",
    title: "The Wedding Teaser",
    slug: { current: "the-teaser" },
    order: 1,
    location: "Calicut, Kerala",
    duration: "Teaser · 60–90 sec",
    description:
      "A short, high-impact cut delivered within weeks of the wedding. Made to be shared from the car on the way home.",
    youtubeId: "znvVRN1awcc",
  },
  {
    _id: "film-save-the-date",
    _type: "film",
    title: "Save-the-Date Film",
    slug: { current: "save-the-date" },
    order: 2,
    location: "Wayanad, Kerala",
    duration: "Pre-wedding · 2–3 min",
    description:
      "Shot on location months before the day — mist over the tea estates, the two of you walking ahead. The announcement with intent.",
    youtubeId: "LD7Z8_gTSH8",
  },
  {
    _id: "film-storytelling-film",
    _type: "film",
    title: "Storytelling Film",
    slug: { current: "storytelling-film" },
    order: 3,
    location: "Ahmedabad, Gujarat",
    duration: "Story · 5–8 min",
    description:
      "Films focused on emotion, people and personality rather than simply chronological coverage.",
    youtubeId: "bF1HWBMYiqk",
  },
  {
    _id: "film-highlights",
    _type: "film",
    title: "Highlight Film",
    slug: { current: "highlights" },
    order: 4,
    location: "Kerala",
    duration: "Highlights · 3–4 min",
    description:
      "Documenting celebrations, ceremonies, family interactions and important moments with a cinematic visual approach.",
    youtubeId: "Be-OFEhGUxQ",
  },
  {
    _id: "film-reels",
    _type: "film",
    title: "Reels & Social Cut",
    slug: { current: "reels" },
    order: 5,
    location: "India & worldwide",
    duration: "Reels · 15–60 sec",
    description:
      "Vertical cuts built for sharing, drawn from the same coverage as the feature film.",
    youtubeId: "GZiu5-_Zwkw",
  },
  {
    _id: "film-arun-diana",
    _type: "film",
    title: "Arun & Diana",
    slug: { current: "arun-diana" },
    order: 6,
    location: "Kerala",
    duration: "Feature",
    description:
      "A full Kerala wedding story — the ceremony, the family and the celebration, edited as cinema.",
    youtubeId: "kdRKkLJkZgI",
  },
  {
    _id: "film-sangeeth-sruthi",
    _type: "film",
    title: "Sangeeth & Sruthi",
    slug: { current: "sangeeth-sruthi" },
    order: 7,
    location: "Kerala",
    duration: "Feature",
    description: "Their wedding day told end to end — quiet moments and loud celebrations alike.",
    youtubeId: "YMOYz-KhvEQ",
  },
  {
    _id: "film-rarun-amisha",
    _type: "film",
    title: "Rarun & Amisha",
    slug: { current: "rarun-amisha" },
    order: 8,
    location: "Kerala",
    duration: "Feature",
    description: "A Kerala wedding film — vows, rituals and the people who made the day.",
    youtubeId: "UrGMsSwgdKE",
  },
  {
    _id: "film-manish-kritika-pre-wedding",
    _type: "film",
    title: "Manish & Kritika",
    slug: { current: "manish-kritika-pre-wedding" },
    order: 9,
    location: "Pre-wedding",
    duration: "Pre-wedding documentary",
    description: "A pre-wedding documentary — their story, in their own words and places.",
    youtubeId: "1N3foXgTtHo",
  },
];

for (const doc of docs) {
  await client.createOrReplace(assignKeys(toImageFields(doc)));
  console.log(`ok   ${doc._type} ${doc._id}`);
}
console.log(`\nSeeded ${docs.length} documents into "${dataset}". Open /studio to edit.`);
