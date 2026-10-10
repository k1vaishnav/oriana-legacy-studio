/**
 * Awards, milestones and press, as supplied by the client.
 *
 * These are factual claims about the business, so the copy here is the client's
 * wording and is deliberately not embellished. Each award keeps its own calendar
 * year alongside the "Year N" tenure label, because the two differ — several
 * badges share a year — and conflating them reads as padding.
 */
export type Award = {
  /** Tenure label as it appears on the medal, e.g. "YEAR 5". */
  tenure: string;
  /** Calendar year of the award. */
  year: number;
  title: string;
  /** The short line on the medal face. */
  headline: string;
  /** The longer line beneath it. */
  detail: string;
};

export const awards: Award[] = [
  {
    tenure: "YEAR 3",
    year: 2019,
    title: "Rising Star Award",
    headline: "Best Emerging Photography Studio",
    detail: "Recognized as the best emerging photography studio.",
  },
  {
    tenure: "YEAR 3",
    year: 2019,
    title: "100+ Stories Milestone",
    headline: "Completed 100+ Weddings",
    detail: "Completed 100+ weddings across multiple destinations.",
  },
  {
    tenure: "YEAR 4",
    year: 2020,
    title: "Couples' Choice Award",
    headline: "Recognized for Outstanding Service",
    detail: "Won top honours for five-star client ratings and service.",
  },
  {
    tenure: "YEAR 5",
    year: 2021,
    title: "Best Cinematic Film",
    headline: "Best Wedding Film & Trailer",
    detail: "Awarded best wedding film and trailer in the industry.",
  },
  {
    tenure: "YEAR 6",
    year: 2022,
    title: "Canon Brand Showcase",
    headline: "Featured Storytellers",
    detail: "Highlighted as featured storytellers by Canon.",
  },
  {
    tenure: "YEAR 7",
    year: 2023,
    title: "Best Destination Studio",
    headline: "Luxury Destination Weddings",
    detail: "Awarded for excellence in luxury destination wedding coverage.",
  },
  {
    tenure: "YEAR 8",
    year: 2024,
    title: "Top 10 Luxury Studio",
    headline: "Top Influential Photo Brands",
    detail: "Named among the top ten wedding photography brands.",
  },
  {
    tenure: "YEAR 9",
    year: 2025,
    title: "Candid Excellence Award",
    headline: "Raw, Emotional Capture",
    detail: "Honoured for capturing raw, emotional wedding moments.",
  },
  {
    tenure: "YEAR 9",
    year: 2025,
    title: "500+ Global Weddings",
    headline: "International Venues",
    detail: "Expanded footprint across international wedding venues.",
  },
  {
    tenure: "YEAR 10",
    year: 2026,
    title: "Decade of Excellence",
    headline: "1,000+ Love Stories Told",
    detail: "Celebrated ten years and over 1,000 love stories documented.",
  },
];

/** The company story, as a year / title / description table. */
export const milestones: { year: string; title: string; description: string }[] = [
  {
    year: "Year 1",
    title: "The Beginning",
    description: "The vision of Oriana Weddings was born to document once-in-a-lifetime moments.",
  },
  {
    year: "Year 3",
    title: "100+ Stories",
    description: "Successfully captured over 100 unique wedding stories across the country.",
  },
  {
    year: "Year 5",
    title: "Industry Award",
    description: "Honoured with the Best Creative Photography Award for cinematic storytelling.",
  },
  {
    year: "Year 8",
    title: "Couples' Choice",
    description: "Awarded the Couples' Choice Award for outstanding service and client trust.",
  },
  {
    year: "Year 10",
    title: "Decade Milestone",
    description: "Celebrated 10 years of excellence with over 1,000+ weddings documented.",
  },
];

/**
 * Press and publications.
 *
 * Rendered as typographic wordmarks, not logo artwork: we do not hold licence to
 * republish another publisher's logo, and a row of mismatched typeset words reads
 * worse than a row of real marks. Each name is written to be a drop-in point for
 * an official asset — see `pressAsset` in PressStrip.
 */
export const press: { name: string; url: string }[] = [
  { name: "WeddingSutra", url: "https://www.weddingsutra.com" },
  { name: "Vogue", url: "https://www.vogue.com" },
  { name: "Film Companion", url: "https://www.filmcompanion.in" },
  { name: "India Film Project", url: "https://www.indiafilmproject.com" },
  { name: "Asian Photography", url: "https://www.asianphotography.com" },
  { name: "India Art Fair", url: "https://indiaartfair.com" },
  { name: "Pinkvilla", url: "https://www.pinkvilla.com" },
  { name: "Sabyasachi", url: "https://www.sabyasachi.com" },
  { name: "Traveller", url: "https://traveller.com.au" },
  { name: "Wedding Vows", url: "https://www.weddingvows.com" },
];

/**
 * Equipment and software.
 *
 * Every entry links to the manufacturer's own page for the product, so the gear
 * list is verifiable rather than decorative. Names and logos are trademarks of
 * their respective owners and are used to identify the equipment in use.
 */
export const gear: { name: string; kind: string; url: string }[] = [
  { name: "Sony", kind: "Camera", url: "https://www.sony.com/en/Sony-Corporate" },
  { name: "Canon", kind: "Camera", url: "https://global.canon/en/" },
  { name: "Nikon", kind: "Camera", url: "https://www.nikon.com/" },
  { name: "DJI", kind: "Aerial", url: "https://www.dji.com/" },
  { name: "Leica", kind: "Camera", url: "https://www.leica-camera.com/" },
  { name: "Zeiss", kind: "Lens", url: "https://www.zeiss.com/camera/en.html" },
];

/**
 * The post-production desk. Separate from `gear` because the brief splits them:
 * what the photographs are made with, and what the films are finished on.
 */
export const software: { name: string; kind: string; url: string }[] = [
  {
    name: "After Effects",
    kind: "Motion",
    url: "https://www.adobe.com/products/aftereffects.html",
  },
  { name: "Premiere Pro", kind: "Edit", url: "https://www.adobe.com/products/premiere.html" },
  { name: "Final Cut Pro", kind: "Edit", url: "https://www.apple.com/final-cut-pro/" },
  {
    name: "DaVinci Resolve",
    kind: "Grade",
    url: "https://www.blackmagicdesign.com/products/davinciresolve",
  },
  { name: "Lightroom", kind: "Colour", url: "https://www.adobe.com/products/lightroom.html" },
  { name: "Photoshop", kind: "Retouch", url: "https://www.adobe.com/products/photoshop.html" },
];
