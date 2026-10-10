import { Link } from "@tanstack/react-router";

import { getImage, type ImageKey } from "@/lib/image-manifest";
import { useSiteSettings, whatsappHrefFor } from "@/lib/cms";
import { PhotoImage } from "@/lib/images";
import type { CmsAsset } from "@/lib/sanity-image";

/**
 * Quiet, full-bleed introduction for the homepage.
 *
 * Pure image on its own left phones with a pretty but mute first screen, so
 * the frame now carries the one-line promise and two thumb-sized actions.
 * Bottom-anchored and safe-area aware: the headline never hides behind the
 * floating call bar, and both targets clear 44px.
 *
 * The frame is the LCP element, so it is never lazy: eager, synchronous
 * decode, `fetchPriority="high"`, and a full AVIF → WebP → JPEG ladder at
 * 100vw so the browser picks the right bytes instead of a too-small default.
 * Width/height from the manifest reserve the space before a byte arrives, and
 * the blurred placeholder plus dominant colour sit behind it — inlined, so
 * they cost no request.
 */
export function EditorialHero({
  image = "home-hero-user",
  alt,
  asset,
  eyebrow = "Oriana Weddings · Photography & Films",
  title = "Your wedding, our responsibility.",
  sub = "Candid, traditional & cinematic — managed by Oriana.",
  primaryLabel = "View our work",
  secondaryLabel = "Enquire",
}: {
  image?: ImageKey;
  alt: string;
  /** CMS-uploaded replacement for `image`; the archive frame stays as fallback. */
  asset?: CmsAsset | null | undefined;
  eyebrow?: string;
  title?: string;
  sub?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  const settings = useSiteSettings();
  const entry = getImage(image);

  return (
    <section className="home-hero-wrap" aria-label="Oriana Weddings Hero">
      <div
        className="home-hero-frame"
        style={{
          backgroundColor: entry.color,
          backgroundImage: `url("${entry.lqip}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <PhotoImage
          photo={{ key: image, alt, asset: asset ?? null }}
          sizes="100vw"
          eager
          className="contents"
          imgClassName="home-hero-image"
        />
        <div className="home-hero-scrim" aria-hidden="true" />
        <div className="home-hero-content">
          <p className="home-hero-eyebrow">{eyebrow}</p>
          <h1 className="home-hero-title">{title}</h1>
          <p className="home-hero-sub">{sub}</p>
          <div className="home-hero-ctas">
            <Link to="/portfolio" className="home-hero-cta home-hero-cta-primary">
              {primaryLabel}
            </Link>
            <a
              href={whatsappHrefFor(
                settings,
                "Hello Oriana Weddings, I would love to enquire about my wedding.",
              )}
              target="_blank"
              rel="noreferrer"
              className="home-hero-cta home-hero-cta-ghost"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
