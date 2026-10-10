import { useState } from "react";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";

import { ClosingCTA } from "@/components/site/ClosingCTA";
import { Lightbox } from "@/components/site/Lightbox";
import { Reveal } from "@/components/site/Reveal";
import { PhotoImage } from "@/lib/images";
import { business } from "@/lib/site";
import { getBrand, getBrandsPage, photoSrc, useSiteSettings, whatsappHrefFor } from "@/lib/cms";
import { PageHero } from "@/components/site/PageHero";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/brands/$slug")({
  loader: async ({ params }) => {
    const brand = await getBrand(params.slug);
    if (!brand) throw notFound();
    // Oriana Weddings is the house itself — its "detail page" is the homepage.
    if (brand.slug === "oriana-weddings") throw redirect({ to: "/", statusCode: 301 });
    const page = await getBrandsPage();
    return { brand, backLabel: page.backLabel };
  },
  head: ({ loaderData }) => {
    const brand = loaderData!.brand;
    return seo({
      title: brand.seoTitle ?? `${brand.name} | Our Brands | ${business.name}`,
      description: brand.seoDescription ?? `${brand.tagline} ${brand.description}`,
      path: `/brands/${brand.slug}`,
      image: photoSrc(brand.cover),
    });
  },
  component: BrandPage,
});

function BrandPage() {
  const { brand, backLabel } = Route.useLoaderData();
  const settings = useSiteSettings();
  const { business } = settings;
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos = brand.images;

  return (
    <>
      <PageHero
        eyebrow="Our brands"
        title={brand.name}
        lead={`${brand.tagline} ${brand.description}`}
        photo={brand.cover}
        meta={[{ label: "For", value: brand.audience }]}
        crumb={[{ name: "Brands", to: "/brands" }, { name: brand.name }]}
      />

      <main className="story-page">
        {/* What the brand does, and who it is for. */}
        <section className="section surface-paper" aria-label={`About ${brand.name}`}>
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow mb-5">What {brand.name} does</p>
              <ul className="flex flex-col">
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
                {backLabel}
              </Link>
            </Reveal>
          </div>
        </section>

        {/* The work. */}
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
                <PhotoImage photo={photo} sizes="(min-width: 900px) 48vw, 100vw" zoom />
              </button>
            </Reveal>
          ))}
        </section>

        <footer className="story-detail-footer">
          <p>
            {brand.name} · {business.phone}
          </p>
          <a href={business.phoneHref} className="link text-base text-ink">
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
