import manifest from "./images.json";

/** Derived from the generated file, so a stale key is a type error, not a blank image. */
type Manifest = typeof manifest;
export type ImageKey = keyof Manifest;
type Entry = Manifest[ImageKey];

export const getImage = (key: ImageKey): Entry => manifest[key];

type Source = { avif: string; webp: string; jpeg: string };

/** `srcset` for one format across the whole generated width ladder. */
export const srcSet = (key: ImageKey, format: "avif" | "webp" | "jpeg"): string => {
  const entry = getImage(key);
  // The manifest keys `sources` by width as a string; JSON import types those as
  // literal properties, so the lookup needs the index-signature view.
  const sources = entry.sources as unknown as Record<string, Source>;
  return entry.widths
    .map((w) => {
      const source = sources[String(w)];
      // Every width in the manifest is generated in both formats, so a
      // miss means the manifest is out of step with public/img.
      if (!source) throw new Error(`No ${format} variant for ${key} at ${w}w`);
      return `${source[format]} ${w}w`;
    })
    .join(", ");
};
