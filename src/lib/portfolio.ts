import heroImage from "@/assets/oriana-weddings-calicut-cinematic-wedding-hero.jpg";
import candidImage from "@/assets/oriana-weddings-kozhikode-candid-bridal-moment.jpg";
import churchImage from "@/assets/oriana-weddings-calicut-church-wedding-ceremony.jpg";
import wayanadImage from "@/assets/oriana-weddings-wayanad-pre-wedding-shoot.jpg";
import filmStill from "@/assets/oriana-weddings-kerala-cinematic-wedding-film-still.jpg";
import detailsImage from "@/assets/oriana-weddings-kerala-wedding-details-jasmine-gold.jpg";
import beachImage from "@/assets/oriana-weddings-kozhikode-beach-post-wedding-portrait.jpg";
import aerialImage from "@/assets/oriana-weddings-kerala-drone-wedding-venue-aerial.jpg";

export const gallery = {
  hero: {
    src: heroImage,
    width: 1920,
    height: 1280,
    alt: "Kerala bride and groom in cream and gold attire walking through a sunlit Calicut courtyard, photographed by Oriana Weddings",
  },
  candid: {
    src: candidImage,
    width: 1024,
    height: 1408,
    alt: "Bride laughing with her sisters while getting ready for a Kerala wedding in Kozhikode",
  },
  church: {
    src: churchImage,
    width: 1408,
    height: 1008,
    alt: "Bride and groom exchanging rings during a church wedding ceremony in Calicut",
  },
  wayanad: {
    src: wayanadImage,
    width: 1600,
    height: 1008,
    alt: "Couple on a misty Wayanad tea estate during a pre-wedding shoot at sunrise",
  },
  film: {
    src: filmStill,
    width: 1920,
    height: 1088,
    alt: "Cinematic wedding film still of a bride's veil catching evening light at a Kerala reception",
  },
  details: {
    src: detailsImage,
    width: 1200,
    height: 1200,
    alt: "Jasmine flowers and gold bangles arranged on silk, a Kerala wedding detail",
  },
  beach: {
    src: beachImage,
    width: 1408,
    height: 1008,
    alt: "Couple walking along a Kozhikode beach at golden hour for a post-wedding portrait session",
  },
  aerial: {
    src: aerialImage,
    width: 1600,
    height: 1008,
    alt: "Aerial drone view of a Kerala wedding venue surrounded by coconut palms",
  },
} as const;

export type GalleryKey = keyof typeof gallery;

export type Wedding = {
  slug: string;
  title: string;
  location: string;
  category: "Candid" | "Traditional" | "Church" | "Pre-wedding" | "Destination";
  season: string;
  cover: GalleryKey;
  summary: string;
  story: string[];
  frames: GalleryKey[];
  services: string[];
};

export const weddings: Wedding[] = [
  {
    slug: "calicut-church-wedding",
    title: "A Calicut Church Wedding",
    location: "Kozhikode, Kerala",
    category: "Church",
    season: "January",
    cover: "church",
    summary:
      "Vows beneath stained glass in Calicut, followed by a courtyard reception lit by evening sun.",
    story: [
      "The morning began quietly — the family home in Kozhikode filling slowly with cousins, the bride's veil laid out across a bed of jasmine.",
      "Inside the church, the light fell in long coloured bars across the aisle. We photographed the ceremony without interrupting it: the ring, the blessing, the parents watching from the second pew.",
      "By evening the courtyard had turned gold, and the reception became a portrait session of everyone who had travelled to be there.",
    ],
    frames: ["church", "details", "candid", "hero"],
    services: ["Candid photography", "Traditional photography", "Cinematic wedding film"],
  },
  {
    slug: "wayanad-pre-wedding-story",
    title: "Mist & Tea Estates",
    location: "Wayanad, Kerala",
    category: "Pre-wedding",
    season: "August",
    cover: "wayanad",
    summary:
      "A sunrise pre-wedding shoot across Wayanad's tea estates, shot entirely in natural light.",
    story: [
      "We left Kozhikode at three in the morning to reach the estate before the mist lifted.",
      "For two hours the couple simply walked and talked while we worked at a distance — the frames that followed needed no direction at all.",
      "The film cut from this session became their save-the-date, scored to a single Malayalam guitar line.",
    ],
    frames: ["wayanad", "beach", "film", "aerial"],
    services: ["Pre-wedding photography", "Save-the-date film", "Drone cinematography"],
  },
  {
    slug: "malappuram-candid-wedding",
    title: "A House Full of Love",
    location: "Malappuram, Kerala",
    category: "Candid",
    season: "March",
    cover: "candid",
    summary:
      "A traditional Malappuram wedding photographed candidly, from the henna evening to the send-off.",
    story: [
      "Three days, one house, and a family that never stopped moving.",
      "We covered the henna evening, the nikah, and the send-off, staying close to the bride's sisters — the true narrators of the day.",
      "The final album reads like a documentary: unposed, warm, and impossible to reconstruct.",
    ],
    frames: ["candid", "details", "hero", "beach"],
    services: ["Candid photography", "Live screening", "Photobooth"],
  },
  {
    slug: "kozhikode-beach-post-wedding",
    title: "Golden Hour by the Arabian Sea",
    location: "Kozhikode Beach, Kerala",
    category: "Destination",
    season: "November",
    cover: "beach",
    summary:
      "A post-wedding portrait session on Kozhikode beach, timed to the last twenty minutes of light.",
    story: [
      "Post-wedding sessions give us the one thing a wedding day never does — time.",
      "We waited for the light to drop below the horizon line and let the couple wander the shore.",
      "The result is quiet, cinematic, and entirely theirs.",
    ],
    frames: ["beach", "hero", "wayanad", "film"],
    services: ["Post-wedding photography", "Cinematic film", "Drone shoot"],
  },
  {
    slug: "traditional-kerala-wedding",
    title: "Silk, Gold & Ritual",
    location: "Kozhikode, Kerala",
    category: "Traditional",
    season: "May",
    cover: "hero",
    summary:
      "A complete traditional Kerala wedding — every ritual documented, every elder portrait made.",
    story: [
      "Traditional coverage is a discipline: nothing may be missed, and nothing may be rushed.",
      "We photographed each ritual in sequence and made formal portraits of every family group before the sadya.",
      "The archive runs to over two thousand frames; the album to eighty.",
    ],
    frames: ["hero", "details", "church", "candid"],
    services: ["Traditional photography", "Candid photography", "Wedding film"],
  },
  {
    slug: "destination-wedding-aerials",
    title: "A Venue From Above",
    location: "Kerala backwaters",
    category: "Destination",
    season: "December",
    cover: "aerial",
    summary:
      "Drone-led coverage of a backwater destination wedding across coconut groves and water.",
    story: [
      "Some venues can only be understood from the air.",
      "We opened the film with a single rising aerial that held for eighteen seconds before the first cut.",
      "On the ground, two photographers and two cinematographers covered three simultaneous events.",
    ],
    frames: ["aerial", "film", "hero", "beach"],
    services: ["Drone shoots", "Cinematic wedding film", "Candid photography"],
  },
];

export const findWedding = (slug: string) => weddings.find((w) => w.slug === slug);
