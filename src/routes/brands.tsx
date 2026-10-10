import { createFileRoute, Link } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/site/Marquee";
import { Arrow, SectionHead, SplitHead } from "@/components/site/ui";
import { PageHero } from "@/components/site/PageHero";
import { BrandMark } from "@/lib/BrandMark";
import { getBrands, getBrandsPage } from "@/lib/cms";
import type { GroupBrand } from "@/lib/site";

export const Route = createFileRoute("/brands")({
  loader: async () => ({
    brands: await getBrands(),
    page: await getBrandsPage(),
  }),
  head: ({ loaderData }) =>
    seo({
      title: loaderData?.page.seoTitle || "Our Brands | Oriana Weddings | Creative Brands",
      description:
        loaderData?.page.seoDescription ||
        "Meet the creative brands of Oriana — Oriana Weddings, Baby Crew Studios, DEOR Fashion, ORION Events and Odonata Republic.",
      path: "/brands",
    }),
  component: BrandsPage,
});

/**
 * The brands.
 *
 * This is a brand-architecture page, not a directory. Each brand is listed with
 * what it actually does, and every card links to that brand's own detail page —
 * a shareable URL (`/brands/<slug>`) with the brand's story, work and enquiry,
 * so someone who only wants one brand can be sent exactly that.
 */
function BrandsPage() {
  const { brands, page } = Route.useLoaderData();
  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        lead={page.heroLead}
        photo={{ ...page.heroImage, alt: page.heroImageAlt }}
        meta={[
          { label: page.metaFirstLabel, value: `${brands.length}` },
          { label: page.metaSecondLabel, value: page.metaSecondValue },
        ]}
        crumb={[{ name: "Brands" }]}
      />

      <section className="section surface-paper">
        <div className="shell">
          <SplitHead eyebrow={page.whyEyebrow} title={page.whyTitle} lead={page.whyLead} />
        </div>
      </section>

      {/* The brands. Numbered, since it is a list, not a gallery. The whole
          card is the link: clicking anywhere opens the brand's own detail page.
          Oriana Weddings is the house itself, so its card goes home. */}
      <section className="section-flush surface-paper pb-16 sm:pb-24">
        <div className="shell-wide flex flex-col">
          {brands.map((brand, index) => (
            <Reveal key={brand.name} delay={index * 0.05}>
              <BrandCard brand={brand} index={index} />
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee tone="cream" items={brands.map((brand) => brand.name)} slow />

      {/* How the group runs. */}
      <section className="section surface-cream">
        <div className="shell">
          <SectionHead eyebrow={page.approachEyebrow} title={page.approachTitle} />
          <Reveal className="mt-12">
            <div className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
              {(page.approachCards.length > 0
                ? page.approachCards
                : [
                    {
                      title: "In-house management",
                      body: "The brands are run, not merely branded. The management decisions that affect your work are made by the group rather than outsourced to whoever is free.",
                    },
                    {
                      title: "One point of contact",
                      body: "Whoever you deal with stays your contact through delivery. The group does not pass you between brands because the enquiry was easier that way.",
                    },
                    {
                      title: "Selected professionals",
                      body: "The same selection principle that runs Oriana Weddings runs across the group: match the professional to the work, and keep the decision with the studio.",
                    },
                    {
                      title: "Quality management",
                      body: "The work is reviewed against the brief before delivery, on our side, every time.",
                    },
                    {
                      title: "Written terms",
                      body: "Scope, deliverables and payment terms are agreed in writing before work begins, on every brand.",
                    },
                    {
                      title: "Privacy respected",
                      body: "Confidential coverage is available, and nothing is published or shared without permission.",
                    },
                  ]
              ).map((item, index) => (
                <article key={item.title} className="flex flex-col gap-2 border-t border-line py-6">
                  <span className="tabular text-xs gold">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="text-base font-medium">{item.title}</h3>
                  <p className="text-sm mute">{item.body}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}

/**
 * One brand row, clickable end to end.
 *
 * No photographs here — the list is a directory, and the pictures live on the
 * detail pages. Oriana Weddings is the house itself rather than a sub-brand,
 * so its card links home instead of to a detail page.
 */
function BrandCard({ brand, index }: { brand: GroupBrand; index: number }) {
  const body = (
    <article className="grid gap-5 border-t border-line py-10 transition-colors lg:grid-cols-12 lg:gap-12 lg:py-14">
      <div className="flex items-start gap-5 lg:col-span-4">
        <BrandMark name={brand.name} className="size-12 shrink-0 text-gold sm:size-14" />
        <div className="flex flex-col gap-2">
          <h2 className="text-h3 max-w-[16ch]">{brand.name}</h2>
          <span className="tabular text-xs gold">{String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:col-span-5">
        <p className="text-base text-ink/75">{brand.tagline}</p>
        <p className="text-sm mute">{brand.description}</p>
        <p className="text-sm mute">{brand.audience}</p>
      </div>
      <div className="flex items-start lg:col-span-3">
        <span className="btn btn-line hover:btn-line-hover" aria-hidden="true">
          {brand.slug === "oriana-weddings" ? "Go to homepage" : `About ${brand.name}`}
          <Arrow />
        </span>
      </div>
    </article>
  );

  return brand.slug === "oriana-weddings" ? (
    <Link to="/" aria-label="Oriana Weddings — go to homepage" className="block">
      {body}
    </Link>
  ) : (
    <Link
      to="/brands/$slug"
      params={{ slug: brand.slug }}
      aria-label={`About ${brand.name}`}
      className="block"
    >
      {body}
    </Link>
  );
}
