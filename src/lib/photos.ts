/**
 * Photo registry.
 *
 * Every photograph on the site is requested by a semantic name from here rather
 * than by a manifest key at the call site. That keeps the "which picture goes
 * in which slot" decision in one reviewable file, and it means swapping the
 * studio's archive is a matter of editing the keys in one place rather than
 * hunting through ten routes.
 *
 * Each entry pairs a key with the alt text that describes it, because a wrong
 * or missing alt is the only thing standing between a photograph and a screen
 * reader.
 *
 * The registry holds exactly the 30 photographs in the local archive
 * (`src/assets`, generated to `public/img` with `images.json`). Nothing here
 * may reference a key outside that set — an unregistered key is a blank image
 * at runtime, and the type of `getImage` turns it into a build error instead.
 */
import { getImage } from "@/lib/image-manifest";

export type PhotoKey = Parameters<typeof getImage>[0];

export type Photo = { key: PhotoKey; alt: string };

/** A photograph with a short editorial line for the carousel captions. */

/**
 * The studio's archive anchors.
 *
 * The eight frames that carry the most authenticity get the positions where
 * authenticity does the work: the home hero, the church stories, the films
 * opener and the closing call to action.
 */
export const originals: Photo[] = [
  {
    key: "home-hero-user",
    alt: "Newlywed couple sharing a quiet moment, photographed by Oriana Weddings",
  },
  {
    key: "hero-traditional-intimate",
    alt: "Bride and groom together in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "calicut-cinematic-wedding-hero",
    alt: "Bride in a red veil at night, photographed by Oriana Weddings",
  },
  {
    key: "kerala-cinematic-wedding-film-still",
    alt: "Bride celebrating with sparklers among loved ones, photographed by Oriana Weddings",
  },
  {
    key: "calicut-church-wedding-ceremony",
    alt: "Wedding ceremony with family and friends, photographed by Oriana Weddings",
  },
  {
    key: "church-golden-altar",
    alt: "Bride in a gold veil and temple jewellery, photographed by Oriana Weddings",
  },
  {
    key: "portrait-bride-sunlight",
    alt: "Kerala bride in gold jewellery at a doorway, photographed by Oriana Weddings",
  },
  {
    key: "closing-cta-user",
    alt: "Newlywed couple at home, photographed by Oriana Weddings",
  },
];

/**
 * Full-viewport hero rotation. The lead frame is the home hero, so the first
 * thing a visitor sees is the studio's own work rather than stock.
 */
export const hero: Photo[] = [originals[0]!, originals[1]!, originals[2]!, originals[3]!];

/** Rituals and ceremonies — the proof that we cover Kerala and Christian alike. */
export const ceremonies: Photo[] = [
  {
    key: "ceremony-temple-ritual",
    alt: "Bride in red and gold jewellery, photographed by Oriana Weddings",
  },
  {
    key: "ceremony-south-asian-prewedding",
    alt: "Newlywed couple sharing a quiet moment outdoors, photographed by Oriana Weddings",
  },
  {
    key: "church-altar-candid",
    alt: "Veiled bride with the groom, photographed by Oriana Weddings",
  },
  {
    key: "church-outside-joy",
    alt: "Newlywed couple laughing together outdoors, photographed by Oriana Weddings",
  },
  {
    key: "haldi-bride-with-friends",
    alt: "Bride and groom in vibrant wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "detail-bride-henna-face",
    alt: "Bride during the haldi ceremony, photographed by Oriana Weddings",
  },
];

/** Christian weddings, including the Calicut church work. */
export const churchWeddings: Photo[] = [
  {
    key: "calicut-church-wedding-ceremony",
    alt: "Wedding ceremony with family and friends, photographed by Oriana Weddings",
  },
  {
    key: "church-golden-altar",
    alt: "Bride in a gold veil and temple jewellery, photographed by Oriana Weddings",
  },
  {
    key: "church-altar-candid",
    alt: "Veiled bride with the groom, photographed by Oriana Weddings",
  },
  {
    key: "church-outside-joy",
    alt: "Newlywed couple laughing together outdoors, photographed by Oriana Weddings",
  },
];

/** Haldi and Mehendi — the colour, movement and noise before the wedding day. */
export const preWedding: Photo[] = [
  {
    key: "haldi-bride-with-friends",
    alt: "Bride and groom in vibrant wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "detail-bride-henna-face",
    alt: "Bride during the haldi ceremony, photographed by Oriana Weddings",
  },
  {
    key: "detail-bouquet",
    alt: "Wedding bouquet detail, photographed by Oriana Weddings",
  },
  {
    key: "portrait-bride-sunlight",
    alt: "Kerala bride in gold jewellery at a doorway, photographed by Oriana Weddings",
  },
];

/** Henna and jewellery — the detail work that fills albums. */
export const details: Photo[] = [
  {
    key: "detail-bouquet",
    alt: "Wedding bouquet detail, photographed by Oriana Weddings",
  },
  {
    key: "detail-bride-henna-face",
    alt: "Bride during the haldi ceremony, photographed by Oriana Weddings",
  },
  {
    key: "detail-bride-groom-feet",
    alt: "Couple dancing at their wedding, photographed by Oriana Weddings",
  },
  {
    key: "detail-reception-cake",
    alt: "Wedding reception details, photographed by Oriana Weddings",
  },
  {
    key: "detail-reception-monochrome",
    alt: "Newlywed couple in a quiet moment at home, photographed by Oriana Weddings",
  },
];

/** Venue, reception and the built environment. */
export const venues: Photo[] = [
  {
    key: "detail-reception-cake",
    alt: "Wedding reception details, photographed by Oriana Weddings",
  },
  {
    key: "detail-reception-monochrome",
    alt: "Newlywed couple in a quiet moment at home, photographed by Oriana Weddings",
  },
  {
    key: "closing-cta-user",
    alt: "Newlywed couple at home, photographed by Oriana Weddings",
  },
  {
    key: "church-altar-candid",
    alt: "Veiled bride with the groom, photographed by Oriana Weddings",
  },
];

/** Portraits — the frames that have to survive being looked at closely. */
export const portraits: Photo[] = [
  {
    key: "portrait-bride-sunlight",
    alt: "Kerala bride in gold jewellery at a doorway, photographed by Oriana Weddings",
  },
  {
    key: "hero-traditional-intimate",
    alt: "Bride and groom together in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "detail-reception-monochrome",
    alt: "Newlywed couple in a quiet moment at home, photographed by Oriana Weddings",
  },
  {
    key: "calicut-cinematic-wedding-hero",
    alt: "Bride in a red veil at night, photographed by Oriana Weddings",
  },
  {
    key: "kerala-cinematic-wedding-film-still",
    alt: "Bride celebrating with sparklers among loved ones, photographed by Oriana Weddings",
  },
  {
    key: "haldi-bride-with-friends",
    alt: "Bride and groom in vibrant wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "instagram-01",
    alt: "Wedding moment, photographed by Oriana Weddings",
  },
  {
    key: "instagram-02",
    alt: "Wedding moment, photographed by Oriana Weddings",
  },
  {
    key: "instagram-07",
    alt: "Wedding moment, photographed by Oriana Weddings",
  },
  {
    key: "instagram-08",
    alt: "Wedding moment, photographed by Oriana Weddings",
  },
];

/** The social wall — twelve recent frames, portrait-first for the grid. */
export const instagram: Photo[] = [
  { key: "instagram-01", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-02", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-03", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-04", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-05", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-06", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-07", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-08", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-09", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-10", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-11", alt: "Wedding moment, photographed by Oriana Weddings" },
  { key: "instagram-12", alt: "Wedding moment, photographed by Oriana Weddings" },
];

/**
 * Everything, for the portfolio wall and the lightbox — exactly the 30 frames
 * in the local archive, each once, in a curated order.
 */
export const allPhotos: Photo[] = [
  ...originals,
  ...ceremonies,
  ...details.filter(
    (photo) => ![...originals, ...ceremonies].some((seen) => seen.key === photo.key),
  ),
  ...venues.filter(
    (photo) => ![...originals, ...ceremonies, ...details].some((seen) => seen.key === photo.key),
  ),
  ...portraits.filter(
    (photo) =>
      ![...originals, ...ceremonies, ...details, ...venues].some((seen) => seen.key === photo.key),
  ),
  ...instagram.filter(
    (photo) =>
      ![...originals, ...ceremonies, ...details, ...venues, ...portraits].some(
        (seen) => seen.key === photo.key,
      ),
  ),
];

/**
 * Alt text for a key, looked up from the registry.
 *
 * Routes that address photographs by key rather than by registry entry — the
 * wedding stories, where the frames are data — need the same alt text the wall
 * uses, or the same picture ends up described two different ways. Returns
 * `undefined` for an unregistered key so callers are forced to supply a fallback
 * rather than silently shipping an empty alt.
 */
export const photoAlt = (key: PhotoKey): string | undefined =>
  allPhotos.find((photo) => photo.key === key)?.alt;
