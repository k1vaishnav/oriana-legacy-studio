import { Link } from "@tanstack/react-router";

import type { ImageKey } from "@/lib/image-manifest";
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
 * The frame is the LCP element, so it is never lazy: eager, asynchronous
 * decode, `fetchPriority="high"`, a `<link rel="preload">` from the route
 * head, and a full AVIF → WebP → JPEG ladder at 100vw so the browser picks
 * the right bytes instead of a too-small default. Width/height reserve the
 * space before a byte arrives. There is deliberately no blurred placeholder
 * and no fade: a solid dark frame until the real photograph decodes, then it
 * appears instantly.
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

  return (
    <section className="home-hero-wrap" aria-label="Oriana Weddings Hero">
      {/*
        Solid dark frame, no blurred placeholder: the hero shows nothing until
        the real photograph decodes, then it appears instantly (see `instant`
        below). No blur phase, no fade, no white flash — the ground matches
        the surrounding dark canvas.
      */}
      <div className="home-hero-frame" style={{ backgroundColor: "#171615" }}>
        <PhotoImage
          photo={{ key: image, alt, asset: asset ?? null }}
          sizes="100vw"
          eager
          instant
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
