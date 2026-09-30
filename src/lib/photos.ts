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
    alt: "Kerala bride and groom in cream and gold attire walking through a sunlit Calicut courtyard, photographed by Oriana Weddings",
  },
  {
    key: "calicut-church-wedding-ceremony",
    alt: "Bride and groom exchanging rings during a church wedding ceremony in Calicut, photographed by Oriana Weddings",
  },
  {
    key: "kerala-cinematic-wedding-film-still",
    alt: "Cinematic wedding film still of a bride's veil catching evening light at a Kerala reception, photographed by Oriana Weddings",
  },
  {
    key: "wayanad-pre-wedding-shoot",
    alt: "Couple on a misty Wayanad tea estate during a pre-wedding shoot at sunrise, photographed by Oriana Weddings",
  },
  {
    key: "kozhikode-candid-bridal-moment",
    alt: "Bride laughing with her sisters while getting ready for a Kerala wedding in Kozhikode, photographed by Oriana Weddings",
  },
  {
    key: "kozhikode-beach-post-wedding-portrait",
    alt: "Couple walking along a Kozhikode beach at golden hour for a post-wedding portrait session, photographed by Oriana Weddings",
  },
  {
    key: "kerala-wedding-details-jasmine-gold",
    alt: "Jasmine flowers and gold bangles arranged on silk, a Kerala wedding detail photographed by Oriana Weddings",
  },
  {
    key: "kerala-drone-wedding-venue-aerial",
    alt: "Aerial drone view of a Kerala wedding venue surrounded by coconut palms, photographed by Oriana Weddings",
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
    alt: "Bride and groom embracing during a wedding celebration",
  },
  { key: "hero-beach-laugh", alt: "Bride and groom laughing together during a beach wedding" },
  {
    key: "hero-traditional-intimate",
    alt: "Couple in traditional wedding attire sharing an intimate moment",
  },
  { key: "hero-beach-vows", alt: "Couple exchanging vows on a beach at sunset" },
];

/** Rituals and ceremonies — the proof that we cover Kerala and Christian alike. */
export const ceremonies: Photo[] = [
  { key: "ceremony-temple-ritual", alt: "Bride and groom during a traditional temple ceremony" },
  { key: "ceremony-red-lehenga", alt: "Bride in a red lehenga during an Indian wedding ceremony" },
  {
    key: "ceremony-groom-with-family",
    alt: "Groom surrounded by family during a traditional wedding",
  },
  {
    key: "ceremony-ritual-exchange",
    alt: "Bride and groom exchanging rituals during a wedding ceremony",
  },
  {
    key: "ceremony-groom-ritual-detail",
    alt: "Groom performing a ritual during an Indian wedding",
  },
  {
    key: "ceremony-south-asian-prewedding",
    alt: "Couple in traditional attire during a pre-wedding ceremony",
  },
];

/** Christian weddings, including the Calicut church work. */
export const churchWeddings: Photo[] = [
  {
    key: "church-golden-altar",
    alt: "Bride and groom standing before the altar during a church wedding",
  },
  { key: "church-altar-wide", alt: "Church wedding ceremony with the couple at the altar" },
  { key: "church-vows-elegant", alt: "Bride and groom exchanging vows during a church wedding" },
  { key: "church-outside-joy", alt: "Bride and groom outside a church after their ceremony" },
  { key: "church-red-carpet-aisle", alt: "Wedding couple standing in a church aisle" },
  { key: "church-altar-candid", alt: "Candid moment at the altar during a church wedding" },
];

/** Haldi and Mehendi — the colour, movement and noise before the wedding day. */
export const preWedding: Photo[] = [
  { key: "haldi-couple-celebration", alt: "Couple celebrating together at a Haldi ceremony" },
  { key: "haldi-bride-with-friends", alt: "Bride surrounded by friends at a Haldi ceremony" },
  { key: "haldi-turmeric-moment", alt: "Applying turmeric paste during a Haldi ceremony" },
  { key: "haldi-vibrant-friends", alt: "Friends celebrating at a colourful Haldi ceremony" },
  { key: "haldi-joy", alt: "Joyful moment at a Haldi celebration" },
  { key: "haldi-hands-turmeric", alt: "Hands covered in turmeric at a Haldi ceremony" },
];

/** Henna and jewellery — the detail work that fills albums. */
export const details: Photo[] = [
  { key: "mehndi-ornate-closeup", alt: "Intricate mehndi designs on a bride's hands" },
  { key: "mehndi-henna-jewellery", alt: "Mehndi and traditional jewellery on a bride's hands" },
  { key: "mehndi-gujarat-henna", alt: "Bridal mehndi in a traditional Gujarati style" },
  { key: "mehndi-bangles-henna", alt: "Bride's hands adorned with henna and bangles" },
  { key: "mehndi-hands-adorned", alt: "Adorned bridal hands with henna and jewellery" },
  { key: "mehndi-hands-jewellery", alt: "Bridal hands with henna and gold jewellery" },
  { key: "mehndi-traditional-design", alt: "Traditional mehndi design on a bride's hands" },
  { key: "detail-bride-jewellery-mehndi", alt: "Close-up of a bride's jewellery and mehndi" },
  { key: "detail-bride-henna-face", alt: "Bride with detailed henna and jewellery at a wedding" },
  {
    key: "detail-rings-bouquet",
    alt: "Bride and groom's hands showing wedding rings with a bouquet",
  },
  { key: "detail-rings-hands", alt: "Wedding rings on a couple's hands" },
  { key: "detail-diamond-rings", alt: "Wedding bands shown during a ceremony" },
  { key: "detail-ring-exchange", alt: "Couple exchanging wedding rings" },
  { key: "detail-hands-gold-rings", alt: "Gold wedding rings on a couple's hands" },
  { key: "detail-hands-jewellery", alt: "A couple's hands wearing elegant jewellery" },
  { key: "detail-orange-roses", alt: "Bride holding a bouquet of orange roses" },
  { key: "detail-bouquet-closeup", alt: "Close-up of a wedding bouquet" },
  { key: "detail-groom-bouquet", alt: "Groom holding a wedding bouquet" },
  { key: "detail-bride-groom-feet", alt: "Bride and groom's feet during a traditional wedding" },
];

/** Venue, reception and the built environment. */
export const venues: Photo[] = [
  {
    key: "detail-reception-luxury",
    alt: "Luxury wedding reception table with florals and glassware",
  },
  { key: "detail-venue-setup-indoor", alt: "Wedding venue set up with floral arrangements" },
  { key: "detail-reception-cake", alt: "Wedding reception table with a cake and floral decor" },
  { key: "detail-reception-monochrome", alt: "Reception table setting in black and white" },
];

/** Portraits — the frames that have to survive being looked at closely. */
export const portraits: Photo[] = [
  { key: "portrait-bride-sunlight", alt: "Bride photographed in natural daylight" },
  {
    key: "portrait-bride-window-tiara",
    alt: "Bride in a lace wedding dress looking out of a window",
  },
  { key: "portrait-bride-bouquet-smile", alt: "Bride smiling with her bouquet" },
  { key: "portrait-bride-veil-seated", alt: "Bride seated indoors wearing her veil" },
  {
    key: "portrait-bride-monochrome-veil",
    alt: "Black and white portrait of a bride wearing a veil",
  },
  { key: "portrait-newlywed-traditional", alt: "Newlywed couple in traditional wedding attire" },
  { key: "portrait-bride-jewellery-smile", alt: "Bride in traditional attire wearing jewellery" },
  { key: "portrait-outdoor-embrace", alt: "Bride and groom embracing outdoors" },
  {
    key: "portrait-veil-night-tender",
    alt: "Bride and groom sharing a tender moment under a veil",
  },
  {
    key: "portrait-forest-couple",
    alt: "Bride and groom posing in a forest during their wedding photography",
  },
  { key: "portrait-formal-indoors", alt: "Bride and groom in formal wedding wear" },
  { key: "portrait-beach-walk", alt: "Bride and groom walking along the beach" },
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
