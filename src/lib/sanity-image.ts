/**
 * Sanity CDN image URLs.
 *
 * Small, dependency-free wrapper around `@sanity/image-url` shared by the CMS
 * data layer and the image components (kept separate so neither imports the
 * other). `auto=format` lets the CDN negotiate AVIF/WebP per browser, so one
 * srcset covers every format — the same ladder idea as the local archive.
 */
import imageUrlBuilder from "@sanity/image-url";

type Builder = ReturnType<typeof imageUrlBuilder>;
type ImageSource = Parameters<Builder["image"]>[0];

export type CmsCrop = { top: number; bottom: number; left: number; right: number };
export type CmsHotspot = { x: number; y: number; width: number; height: number };

export type CmsAsset = {
  ref: string;
  width: number;
  height: number;
  lqip?: string | undefined;
  crop?: CmsCrop | null | undefined;
  hotspot?: CmsHotspot | null | undefined;
};

const projectId = import.meta.env?.["VITE_SANITY_PROJECT_ID"] as string | undefined;
const dataset = import.meta.env?.["VITE_SANITY_DATASET"] as string | undefined;

const builder: Builder | null =
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }) : null;

/** Widths ladder, clamped to what the asset actually has (never upscale). */
export function assetWidths(asset: CmsAsset): number[] {
  const widths = [320, 480, 800, 1200, 1600].filter((w) => w < asset.width);
  widths.push(Math.min(asset.width, 1600));
  return [...new Set(widths)];
}

/** CDN URL for one width, or null when unconfigured. */
export function cmsImageUrl(asset: CmsAsset, width: number): string | null {
  if (!builder) return null;
  const source = {
    _type: "image",
    asset: { _type: "reference", _ref: asset.ref },
    ...(asset.crop ? { crop: asset.crop } : {}),
    ...(asset.hotspot ? { hotspot: asset.hotspot } : {}),
  } as ImageSource;
  return builder.image(source).width(Math.min(width, asset.width)).auto("format").quality(80).url();
}

/** Largest useful CDN URL (share images, SEO) — null when unconfigured. */
export function cmsImageSrc(asset: CmsAsset): string | null {
  const widths = assetWidths(asset);
  return cmsImageUrl(asset, widths[widths.length - 1]!);
}
