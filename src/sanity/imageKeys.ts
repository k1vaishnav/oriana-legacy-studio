/**
 * The 30 photographs in the local archive (`src/assets` → `public/img`).
 *
 * CMS image fields don't upload files — they pick one of these keys, so every
 * photograph stays inside the pre-generated AVIF/WebP/JPEG ladder with blur-up
 * placeholders. The runtime validates the key and falls back to the built-in
 * content when it doesn't match, so a typo can never blank an image.
 */
export const IMAGE_KEYS = [
  "calicut-church-wedding-ceremony",
  "calicut-cinematic-wedding-hero",
  "ceremony-south-asian-prewedding",
  "ceremony-temple-ritual",
  "church-altar-candid",
  "church-golden-altar",
  "church-outside-joy",
  "closing-cta-user",
  "detail-bouquet",
  "detail-bride-groom-feet",
  "detail-bride-henna-face",
  "detail-reception-cake",
  "detail-reception-monochrome",
  "haldi-bride-with-friends",
  "hero-traditional-intimate",
  "home-hero-user",
  "instagram-01",
  "instagram-02",
  "instagram-03",
  "instagram-04",
  "instagram-05",
  "instagram-06",
  "instagram-07",
  "instagram-08",
  "instagram-09",
  "instagram-10",
  "instagram-11",
  "instagram-12",
  "kerala-cinematic-wedding-film-still",
  "portrait-bride-sunlight",
] as const;
