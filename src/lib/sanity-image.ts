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
  // Quality 72 (was 80): ~20% fewer bytes, visually identical for wedding
  // photography at these widths. `auto=format` still negotiates AVIF/WebP.
  return builder.image(source).width(Math.min(width, asset.width)).auto("format").quality(72).url();
}

/** Full `srcset` across the asset's width ladder (clamped, never upscaled). */
export function cmsSrcSet(asset: CmsAsset): string {
  return assetWidths(asset)
    .map((w) => {
      const url = cmsImageUrl(asset, w);
      return url ? `${url} ${w}w` : null;
    })
    .filter((s): s is string => s !== null)
    .join(", ");
}

/**
 * Sensible `<img src>` fallback: the smallest width ≥ 800, else the largest.
 * The old code used the largest (1600w) as `src`, so any browser parsing `src`
 * before `srcset` — plus the LCP preload — paid full price. 800w is sharp on
 * phones and a fine placeholder until `srcset` resolves on desktop.
 */
export function cmsFallbackSrc(asset: CmsAsset): string | null {
  const widths = assetWidths(asset);
  const fallback = widths.find((w) => w >= 800) ?? widths[widths.length - 1]!;
  return cmsImageUrl(asset, fallback);
}

/** Largest useful CDN URL (share images, SEO) — null when unconfigured. */
export function cmsImageSrc(asset: CmsAsset): string | null {
  const widths = assetWidths(asset);
  return cmsImageUrl(asset, widths[widths.length - 1]!);
}
