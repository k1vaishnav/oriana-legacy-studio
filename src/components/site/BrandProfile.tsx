import { useState } from "react";
import { Link, notFound } from "@tanstack/react-router";

import { ClosingCTA } from "@/components/site/ClosingCTA";
import { Lightbox } from "@/components/site/Lightbox";
import { Reveal } from "@/components/site/Reveal";
import { PhotoImage } from "@/lib/images";
import { business } from "@/lib/site";
import type { GroupBrand } from "@/lib/site";
import { getBrand, photoSrc, useSiteSettings, whatsappHrefFor } from "@/lib/cms";
import { lcpPreload, seo } from "@/lib/seo";

/**
 * One brand's own page: title, description, photos. Nothing else.
 *
 * Each brand gets a top-level address (`/deor-fashion`) so the link is
 * short enough to share anywhere — "what is DEOR?" gets exactly one page
 * with everything about that company. All four pages share this component;
 * only the slug differs per route file.
 */
export async function brandLoader(slug: string) {
  const brand = await getBrand(slug);
  if (!brand) throw notFound();
  return { brand };
}

export function brandHead(slug: string, brand: GroupBrand) {
  const base = seo({
    title: brand.seoTitle ?? `${brand.name} | ${business.name}`,
    description: brand.seoDescription ?? `${brand.tagline} ${brand.description}`,
    path: `/${slug}`,
    image: photoSrc(brand.cover),
  });
  const preload = lcpPreload(brand.cover, "(min-width: 1024px) 68rem, 92vw");
  return preload ? { ...base, links: [...base.links, preload] } : base;
}

/** Mosaic rhythm for the gallery: wide, narrow, narrow, wide, repeating. */
const SPANS = ["brand-span-wide", "brand-span-narrow", "brand-span-narrow", "brand-span-wide"];
const RATIOS = ["4 / 3", "4 / 5", "4 / 5", "4 / 3"];
const spanFor = (index: number): string => SPANS[index % SPANS.length] ?? "brand-span-wide";
const ratioFor = (index: number): string => RATIOS[index % RATIOS.length] ?? "4 / 3";

export function BrandProfile({ brand }: { brand: GroupBrand }) {
  const settings = useSiteSettings();
  const { business: contact } = settings;
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos = brand.images;

  return (
    <>
      {/* Compact editorial header: words first, in reading order. */}
      <header className="brand-profile-head">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs mute">
              <li className="flex items-center gap-2">
                <Link to="/" className="transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="gold">
                  /
                </span>
                <Link to="/brands" className="transition-colors hover:text-ink">
                  Brands
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="gold">
                  /
                </span>
                <span aria-current="page">{brand.name}</span>
              </li>
            </ol>
          </nav>
          <p className="eyebrow mb-5">Oriana Group · Brand</p>
          <h1 className="text-h1 max-w-[16ch]">{brand.name}</h1>
          <p className="lede mt-6 max-w-[46ch]">{brand.tagline}</p>
        </div>
        {/* The cover at a normal size: an inset band, not a full screen. */}
        <div className="shell">
          <Reveal>
            <div className="brand-cover">
              <PhotoImage
                photo={brand.cover}
                alt={brand.cover.alt || `${brand.name} — ${brand.tagline}`}
                ratio="21 / 9"
                sizes="(min-width: 1024px) 68rem, 92vw"
                eager
                imgClassName="page-hero-image"
              />
            </div>
          </Reveal>
        </div>
      </header>

      <main>
        {/* The abstract: what it is, who it is for, what it does. */}
        <section className="section surface-paper" aria-label={`About ${brand.name}`}>
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow mb-5">The company in brief</p>
              <p className="lede">{brand.description}</p>
              <ul className="mt-10 flex flex-col">
                {brand.offerings.map((offering, index) => (
                  <li
                    key={offering}
                    className="flex items-baseline gap-4 border-t border-line py-5 last:border-b"
                  >
                    <span className="tabular shrink-0 text-xs gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base text-ink">{offering}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9">
              <aside className="brand-facts">
                <p className="eyebrow">Who it is for</p>
                <p className="mt-4 text-base leading-relaxed">{brand.audience}</p>
                <a
                  href={whatsappHrefFor(
                    settings,
                    `Hello Oriana, I'd like to ask about ${brand.name}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ink mt-8 w-full justify-center"
                >
                  Enquire about {brand.name}
                </a>
                <Link to="/brands" className="link mt-5 inline-flex items-center gap-1.5 text-sm">
                  ← All brands
                </Link>
              </aside>
            </Reveal>
          </div>
        </section>

        {/* Selected work: a calm mosaic at normal sizes, not full-bleed frames. */}
        <section className="section surface-cream" aria-label={`${brand.name} photographs`}>
          <div className="shell-wide">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-4">Selected work</p>
                <h2 className="text-h2 max-w-[20ch]">A few frames from {brand.name}</h2>
              </div>
              <p className="text-sm mute">
                {photos.length} photograph{photos.length === 1 ? "" : "s"} — select any to view
              </p>
            </Reveal>
            <div className="brand-gallery mt-10">
              {photos.map((photo, index) => (
                <Reveal
                  key={`${photo.key ?? "cms"}-${index}`}
                  delay={Math.min(index, 4) * 0.05}
                  className={spanFor(index)}
                >
                  <button
                    type="button"
                    onClick={() => setLightbox(index)}
                    className="brand-frame"
                    aria-label={`View ${photo.alt} full-screen`}
                  >
                    <PhotoImage
                      photo={photo}
                      ratio={ratioFor(index)}
                      sizes="(min-width: 1024px) 38vw, 92vw"
                      zoom
                      eager={index === 0}
                      className="brand-frame-image"
                    />
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <footer className="story-detail-footer">
          <p>
            {brand.name} · {contact.phone}
          </p>
          <a href={contact.phoneHref} className="link text-base text-ink">
            Call the studio
          </a>
        </footer>

        {lightbox !== null ? (
          <Lightbox
            photos={photos}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onStep={setLightbox}
          />
        ) : null}
      </main>

      <ClosingCTA />
    </>
  );
}
