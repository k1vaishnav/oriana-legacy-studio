/**
 * Photo registry.
 *
 * Every photograph on the site is requested by a semantic name from here rather
 * than by a manifest key at the call site. That keeps the "which picture goes
 * in which slot" decision in one reviewable file, and it means swapping the
 * temporary placeholders for the studio's real archive is a matter of editing
 * the keys in one place rather than hunting through ten routes.
 *
 * Each entry pairs a key with the alt text that describes it, because the whole
 * page is a single-image gallery and a wrong or missing alt is the only thing
 * standing between a photograph and a screen reader.
 */
import { getImage } from "@/lib/image-manifest";

export type PhotoKey = Parameters<typeof getImage>[0];

export type Photo = { key: PhotoKey; alt: string };

/** A photograph with a short editorial line for the carousel captions. */

/**
 * The studio's own photographs.
 *
 * These eight are the only real Oriana frames in the repository, so they are held
 * apart from the temporary stock and given the positions where authenticity is
 * doing the work: the home hero, the Calicut church story, the films opener.
 * Everything else in this file is a placeholder, and nothing should be designed
 * around a placeholder's composition.
 *
 * They are also lower resolution than the stock — up to 1920px against 2400px —
 * which matters before one is promoted to a full-viewport hero.
 */
export const originals: Photo[] = [
  {
    key: "calicut-cinematic-wedding-hero",
    alt: "Bride in a red veil at night, photographed by Oriana Weddings",
  },
  {
    key: "calicut-church-wedding-ceremony",
    alt: "Wedding ceremony with family and friends, photographed by Oriana Weddings",
  },
  {
    key: "kerala-cinematic-wedding-film-still",
    alt: "Bride celebrating with sparklers among loved ones, photographed by Oriana Weddings",
  },
  {
    key: "wayanad-pre-wedding-shoot",
    alt: "Newlywed couple on a traditional Kerala houseboat, photographed by Oriana Weddings",
  },
  {
    key: "kozhikode-candid-bridal-moment",
    alt: "Bride in a pink saree among the palms, photographed by Oriana Weddings",
  },
  {
    key: "kozhikode-beach-post-wedding-portrait",
    alt: "Newlywed couple laughing together outdoors, photographed by Oriana Weddings",
  },
  {
    key: "kerala-wedding-details-jasmine-gold",
    alt: "Bride in red and gold jewellery, photographed by Oriana Weddings",
  },
  {
    key: "kerala-drone-wedding-venue-aerial",
    alt: "Bride celebrating with sparklers among loved ones, photographed by Oriana Weddings",
  },
];

/**
 * Full-viewport hero rotation. The lead frame is a real Oriana photograph, so the
 * first thing a visitor sees is the studio's own work rather than stock.
 */
export const hero: Photo[] = [
  originals[0]!,
  {
    key: "hero-indian-couple-embrace",
    alt: "Bride in a red veil at night, photographed by Oriana Weddings",
  },
  {
    key: "hero-beach-laugh",
    alt: "Newlywed couple laughing together outdoors, photographed by Oriana Weddings",
  },
  {
    key: "hero-traditional-intimate",
    alt: "Bride and groom together in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "hero-beach-vows",
    alt: "Newlywed couple on a traditional Kerala houseboat, photographed by Oriana Weddings",
  },
];

/** Rituals and ceremonies — the proof that we cover Kerala and Christian alike. */
export const ceremonies: Photo[] = [
  {
    key: "ceremony-temple-ritual",
    alt: "Bride in red and gold jewellery, photographed by Oriana Weddings",
  },
  {
    key: "ceremony-red-lehenga",
    alt: "Bride in red bridal attire at night, photographed by Oriana Weddings",
  },
  {
    key: "ceremony-groom-with-family",
    alt: "Wedding ceremony with family and friends, photographed by Oriana Weddings",
  },
  {
    key: "ceremony-ritual-exchange",
    alt: "Bride and groom in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "ceremony-groom-ritual-detail",
    alt: "Couple holding hands in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "ceremony-south-asian-prewedding",
    alt: "Newlywed couple sharing a quiet moment outdoors, photographed by Oriana Weddings",
  },
];

/** Christian weddings, including the Calicut church work. */
export const churchWeddings: Photo[] = [
  {
    key: "church-golden-altar",
    alt: "Bride in a gold veil and temple jewellery, photographed by Oriana Weddings",
  },
  {
    key: "church-altar-wide",
    alt: "Wedding ceremony with family and friends, photographed by Oriana Weddings",
  },
  {
    key: "church-vows-elegant",
    alt: "Veiled bride with the groom, photographed by Oriana Weddings",
  },
  {
    key: "church-outside-joy",
    alt: "Newlywed couple laughing together outdoors, photographed by Oriana Weddings",
  },
  {
    key: "church-red-carpet-aisle",
    alt: "Bride and groom in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "church-altar-candid",
    alt: "Veiled bride with the groom, photographed by Oriana Weddings",
  },
];

/** Haldi and Mehendi — the colour, movement and noise before the wedding day. */
export const preWedding: Photo[] = [
  {
    key: "haldi-couple-celebration",
    alt: "Couple dancing at their wedding, photographed by Oriana Weddings",
  },
  {
    key: "haldi-bride-with-friends",
    alt: "Bride and groom in vibrant wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "haldi-turmeric-moment",
    alt: "Bride during the haldi ceremony, photographed by Oriana Weddings",
  },
  {
    key: "haldi-vibrant-friends",
    alt: "Bride and groom in vibrant wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "haldi-joy",
    alt: "Bride in a pink saree among the palms, photographed by Oriana Weddings",
  },
  {
    key: "haldi-hands-turmeric",
    alt: "Bride during the haldi ceremony, photographed by Oriana Weddings",
  },
];

/** Henna and jewellery — the detail work that fills albums. */
export const details: Photo[] = [
  {
    key: "mehndi-ornate-closeup",
    alt: "Bride during the haldi ceremony, photographed by Oriana Weddings",
  },
  {
    key: "mehndi-henna-jewellery",
    alt: "Bride in a gold veil and temple jewellery, photographed by Oriana Weddings",
  },
  {
    key: "mehndi-gujarat-henna",
    alt: "Bride during the haldi ceremony, photographed by Oriana Weddings",
  },
  {
    key: "mehndi-bangles-henna",
    alt: "Bride in red and gold jewellery, photographed by Oriana Weddings",
  },
  {
    key: "mehndi-hands-adorned",
    alt: "Bride during the haldi ceremony, photographed by Oriana Weddings",
  },
  {
    key: "mehndi-hands-jewellery",
    alt: "Bride in a gold veil and temple jewellery, photographed by Oriana Weddings",
  },
  {
    key: "mehndi-traditional-design",
    alt: "Bride during the haldi ceremony, photographed by Oriana Weddings",
  },
  {
    key: "detail-bride-jewellery-mehndi",
    alt: "Bride in a gold veil and temple jewellery, photographed by Oriana Weddings",
  },
  {
    key: "detail-bride-henna-face",
    alt: "Bride during the haldi ceremony, photographed by Oriana Weddings",
  },
  {
    key: "detail-rings-bouquet",
    alt: "Bride in red and gold jewellery, photographed by Oriana Weddings",
  },
  {
    key: "detail-rings-hands",
    alt: "Couple holding hands in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "detail-diamond-rings",
    alt: "Couple holding hands in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "detail-ring-exchange",
    alt: "Couple holding hands in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "detail-hands-gold-rings",
    alt: "Couple holding hands in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "detail-hands-jewellery",
    alt: "Bride in a gold veil and temple jewellery, photographed by Oriana Weddings",
  },
  {
    key: "detail-orange-roses",
    alt: "Bride in a pink saree among the palms, photographed by Oriana Weddings",
  },
  {
    key: "detail-bouquet-closeup",
    alt: "Bride in a pink saree among the palms, photographed by Oriana Weddings",
  },
  {
    key: "detail-groom-bouquet",
    alt: "Bride in red and gold jewellery, photographed by Oriana Weddings",
  },
  {
    key: "detail-bride-groom-feet",
    alt: "Couple dancing at their wedding, photographed by Oriana Weddings",
  },
];

/** Venue, reception and the built environment. */
export const venues: Photo[] = [
  {
    key: "detail-reception-luxury",
    alt: "Newlywed couple at home, photographed by Oriana Weddings",
  },
  {
    key: "detail-venue-setup-indoor",
    alt: "Newlywed couple in a quiet moment at home, photographed by Oriana Weddings",
  },
  { key: "detail-reception-cake", alt: "Newlywed couple at home, photographed by Oriana Weddings" },
  {
    key: "detail-reception-monochrome",
    alt: "Newlywed couple in a quiet moment at home, photographed by Oriana Weddings",
  },
];

/** Portraits — the frames that have to survive being looked at closely. */
export const portraits: Photo[] = [
  {
    key: "portrait-bride-sunlight",
    alt: "Kerala bride in gold jewellery at a doorway, photographed by Oriana Weddings",
  },
  {
    key: "portrait-bride-window-tiara",
    alt: "Kerala bride in gold jewellery at a doorway, photographed by Oriana Weddings",
  },
  {
    key: "portrait-bride-bouquet-smile",
    alt: "Bride in red and gold jewellery, photographed by Oriana Weddings",
  },
  {
    key: "portrait-bride-veil-seated",
    alt: "Veiled bride with the groom, photographed by Oriana Weddings",
  },
  {
    key: "portrait-bride-monochrome-veil",
    alt: "Bride in red bridal attire at night, photographed by Oriana Weddings",
  },
  {
    key: "portrait-newlywed-traditional",
    alt: "Bride and groom in vibrant wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "portrait-bride-jewellery-smile",
    alt: "Bride in a gold veil and temple jewellery, photographed by Oriana Weddings",
  },
  {
    key: "portrait-outdoor-embrace",
    alt: "Newlywed couple sharing a quiet moment outdoors, photographed by Oriana Weddings",
  },
  {
    key: "portrait-veil-night-tender",
    alt: "Bride in a red veil at night, photographed by Oriana Weddings",
  },
  {
    key: "portrait-forest-couple",
    alt: "Newlywed couple sharing a quiet moment outdoors, photographed by Oriana Weddings",
  },
  {
    key: "portrait-formal-indoors",
    alt: "Bride and groom in wedding attire, photographed by Oriana Weddings",
  },
  {
    key: "portrait-beach-walk",
    alt: "Newlywed couple laughing together outdoors, photographed by Oriana Weddings",
  },
];

/** Everything, for the portfolio wall and the lightbox. */
export const allPhotos: Photo[] = [
  ...originals,
  ...hero,
  ...ceremonies,
  ...churchWeddings,
  ...preWedding,
  ...details,
  ...venues,
  ...portraits,
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
