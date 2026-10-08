import { Link } from "@tanstack/react-router";

import { whatsappHref } from "@/lib/site";

/**
 * Quiet, full-bleed introduction for the homepage.
 *
 * Pure image on its own left phones with a pretty but mute first screen, so
 * the frame now carries the one-line promise and two thumb-sized actions.
 * Bottom-anchored and safe-area aware: the headline never hides behind the
 * floating call bar, and both targets clear 44px.
 */
export function EditorialHero({ src, alt }: { src: string; alt: string }) {
  return (
    <section className="home-hero-wrap" aria-label="Oriana Weddings Hero">
      <div className="home-hero-frame">
        <img
          src={src}
          alt={alt}
          sizes="(min-width: 768px) 42vw, 100vw"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          className="home-hero-image"
        />
        <div className="home-hero-scrim" aria-hidden="true" />
        <div className="home-hero-content">
          <p className="home-hero-eyebrow">Oriana Weddings · Photography &amp; Films</p>
          <h1 className="home-hero-title">Your wedding, held forever.</h1>
          <p className="home-hero-sub">Candid, traditional &amp; cinematic — managed by Oriana.</p>
          <div className="home-hero-ctas">
            <Link to="/portfolio" className="home-hero-cta home-hero-cta-primary">
              View our work
            </Link>
            <a
              href={whatsappHref(
                "Hello Oriana Weddings, I would love to enquire about my wedding.",
              )}
              target="_blank"
              rel="noreferrer"
              className="home-hero-cta home-hero-cta-ghost"
            >
              Enquire
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
