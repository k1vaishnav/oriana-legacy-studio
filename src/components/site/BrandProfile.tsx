import { useState } from "react";
import { Link, notFound } from "@tanstack/react-router";

import { ClosingCTA } from "@/components/site/ClosingCTA";
import { Lightbox } from "@/components/site/Lightbox";
import { Reveal } from "@/components/site/Reveal";
import { PhotoImage } from "@/lib/images";
import { PageHero } from "@/components/site/PageHero";
import { business } from "@/lib/site";
import type { GroupBrand } from "@/lib/site";
import { getBrand, photoSrc, useSiteSettings, whatsappHrefFor } from "@/lib/cms";
import { lcpPreload, seo } from "@/lib/seo";

/**
 * One brand's own page: title, description, photos. Nothing else.
 *
 * Each brand gets a top-level address (`/baby-crew-studios`) so the link is
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
  const preload = lcpPreload(brand.cover, "100vw");
  return preload ? { ...base, links: [...base.links, preload] } : base;
}

export function BrandProfile({ brand }: { brand: GroupBrand }) {
  const settings = useSiteSettings();
  const { business: contact } = settings;
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos = brand.images;

  return (
    <>
      <PageHero
        eyebrow="Oriana Group"
        title={brand.name}
        lead={brand.tagline}
        photo={brand.cover}
        meta={[{ label: "For", value: brand.audience }]}
        crumb={[{ name: "Home", to: "/" }, { name: brand.name }]}
      />

      <main className="story-page">
        {/* The company, in words. */}
        <section className="section surface-paper" aria-label={`About ${brand.name}`}>
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow mb-5">What {brand.name} does</p>
              <p className="lede">{brand.description}</p>
              <ul className="mt-8 flex flex-col">
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
              <p className="eyebrow mb-5">Who it is for</p>
              <p className="lede">{brand.audience}</p>
              <a
                href={whatsappHrefFor(settings, `Hello Oriana, I'd like to ask about ${brand.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ink mt-8 w-full justify-center"
              >
                Enquire about {brand.name}
              </a>
              <Link to="/brands" className="link mt-5 inline-flex items-center gap-1.5 text-sm">
                ← All brands
              </Link>
            </Reveal>
          </div>
        </section>

        {/* The company, in pictures. */}
        <section className="story-gallery" aria-label={`${brand.name} photographs`}>
          {photos.map((photo, index) => (
            <Reveal
              key={`${photo.key ?? "cms"}-${index}`}
              className={index === 0 ? "story-gallery-lead" : ""}
            >
              <button
                type="button"
                onClick={() => setLightbox(index)}
                className="block w-full cursor-zoom-in"
                aria-label={`View ${photo.alt} full-screen`}
              >
                <PhotoImage
                  photo={photo}
                  sizes="(min-width: 900px) 48vw, 100vw"
                  zoom
                  eager={index === 0}
                />
              </button>
            </Reveal>
          ))}
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
