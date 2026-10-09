import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { ClosingCTA } from "@/components/site/ClosingCTA";
import { Reveal } from "@/components/site/Reveal";
import { ResponsiveImage } from "@/lib/images";
import { BrandMark } from "@/lib/BrandMark";
import { business, groupBrands } from "@/lib/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/oriana-group/$slug")({
  loader: ({ params }) => {
    const brand = groupBrands.find((item) => item.slug === params.slug);
    if (!brand) throw notFound();
    return { brand };
  },
  head: ({ loaderData }) => {
    const brand = loaderData!.brand;
    return seo({
      title: `${brand.name} | Oriana Group`,
      description: `${brand.tagline} ${brand.description}`,
      path: `/oriana-group/${brand.slug}`,
    });
  },
  component: BrandPage,
});

/**
 * One group brand: minimal header, gallery, details, enquire.
 *
 * Deliberately imageless at the top — the brand mark and the words carry the
 * header, and the photographs live in the gallery grid below where they can
 * be looked at rather than scrolled past. Gallery frames are borrowed from
 * the studio's own archive until each brand ships its own set.
 */
function BrandPage() {
  const { brand } = Route.useLoaderData();
  const isWeddings = brand.slug === "oriana-weddings";

  return (
    <>
      <main className="brand-page">
        <header className="brand-page-head shell">
          <Link to="/oriana-group" className="brand-page-back">
            ← All brands
          </Link>
          <div className="brand-page-identity">
            <BrandMark name={brand.name} className="size-16 text-gold sm:size-20" />
            <div>
              <p className="eyebrow">Oriana Group</p>
              <h1 className="mt-3 max-w-[18ch] font-display text-h2 text-ink">{brand.name}</h1>
              <p className="lede mt-3 max-w-[46ch]">{brand.tagline}</p>
            </div>
          </div>
        </header>

        <section className="brand-page-gallery shell" aria-label={`${brand.name} gallery`}>
          <div className="brand-gallery-grid">
            {brand.gallery.map((key, index) => (
              <Reveal key={`${key}-${index}`} delay={Math.min(index, 5) * 0.05}>
                <ResponsiveImage
                  image={key}
                  alt={`${brand.name} — ${brand.tagline}`}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="brand-page-details shell">
          <div className="brand-details-grid">
            <div>
              <p className="eyebrow">What it does</p>
              <p className="mt-4 max-w-[52ch] leading-relaxed text-ink/80">{brand.description}</p>
            </div>
            <div>
              <p className="eyebrow">Who it is for</p>
              <p className="mt-4 max-w-[42ch] leading-relaxed text-ink/80">{brand.audience}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {isWeddings ? (
                  <>
                    <Link to="/wedding-photography" className="btn btn-ink">
                      Explore photography
                    </Link>
                    <Link to="/wedding-films" className="btn btn-line">
                      Watch films
                    </Link>
                  </>
                ) : (
                  <a
                    href={`mailto:${business.email}?subject=${encodeURIComponent(
                      `Enquiry — ${brand.name}`,
                    )}`}
                    className="btn btn-ink"
                  >
                    Enquire about {brand.name}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <ClosingCTA />
    </>
  );
}
