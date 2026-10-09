import { createFileRoute, Link } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/site/Marquee";
import { Arrow, SectionHead, SplitHead } from "@/components/site/ui";
import { BrandMark } from "@/lib/BrandMark";
import { groupBrands, groupStatement } from "@/lib/site";

export const Route = createFileRoute("/oriana-group")({
  head: () =>
    seo({
      title: "Oriana Group | Oriana Weddings | Creative Brands",
      description:
        "Learn about the creative brands connected with the Oriana Group, including Oriana Weddings and related photography, fashion, event and creative services.",
      path: "/oriana-group",
    }),
  component: GroupPage,
});

/**
 * The group.
 *
 * This is a brand-architecture page, not a directory. Each brand is listed with
 * what it actually does, and the useful line for a visitor is the second one:
 * *who each brand is for*. A couple looking for wedding photography and a
 * parent looking for baby photographs are the same household, and the point of
 * the group is that the same house already has an answer for both.
 *
 * The header is text-only on purpose — no big brand image. Each row links to
 * the brand's own page, which carries the gallery and the details.
 */

function GroupPage() {
  return (
    <>
      {/* Minimal text header — no brand imagery. */}
      <section
        className="surface-paper pt-14 pb-10 sm:pt-20 sm:pb-14"
        aria-labelledby="group-heading"
      >
        <div className="shell">
          <p className="eyebrow">The Oriana Group</p>
          <h1 id="group-heading" className="mt-4 max-w-[16ch] font-display text-h2 text-ink">
            Five brands, one house
          </h1>
          <p className="lede mt-4 max-w-[56ch]">{groupStatement}</p>
        </div>
      </section>

      <section className="section surface-paper">
        <div className="shell">
          <SplitHead
            eyebrow="Why more than one brand"
            title="Different work needs different people, but the same standard"
            lead="A wedding, a newborn, a fashion campaign and a 500-guest event are not the same craft. Keeping them in one group means each brand can specialise without reinventing how the business is managed."
          />
        </div>
      </section>

      {/* The brands. Numbered, since it is a list, not a gallery. */}
      <section className="section-flush surface-paper pb-16 sm:pb-24">
        <div className="shell-wide flex flex-col">
          {groupBrands.map((brand, index) => (
            <Reveal key={brand.name} delay={index * 0.05}>
              <article className="grid gap-5 border-t border-line py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
                <div className="flex items-start gap-5 lg:col-span-4">
                  <BrandMark name={brand.name} className="size-12 shrink-0 text-gold sm:size-14" />
                  <div className="flex flex-col gap-2">
                    <h2 className="text-h3 max-w-[16ch]">{brand.name}</h2>
                    <span className="tabular text-xs gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 lg:col-span-5">
                  <p className="text-base text-ink/75">{brand.tagline}</p>
                  <p className="text-sm mute">{brand.description}</p>
                  <p className="text-sm mute">{brand.audience}</p>
                </div>
                <div className="flex items-start lg:col-span-3">
                  <Link
                    to="/oriana-group/$slug"
                    params={{ slug: brand.slug }}
                    className="link group inline-flex items-center gap-1.5 text-sm"
                    aria-label={`Open the ${brand.name} page`}
                  >
                    View {brand.name}
                    <Arrow />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee tone="cream" items={groupBrands.map((brand) => brand.name)} slow />

      {/* How the group runs. */}
      <section className="section surface-cream">
        <div className="shell">
          <SectionHead
            eyebrow="The shared approach"
            title="What every brand in the group does the same way"
          />
          <Reveal className="mt-12">
            <div className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
              {[
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
              ].map((item, index) => (
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
