import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs, ClosingCta, Eyebrow, PageHero, SectionHeading } from "@/components/site/Blocks";
import { ImageReveal, Reveal } from "@/components/site/Reveal";
import { gallery, weddings } from "@/lib/portfolio";
import { SITE_URL, breadcrumbSchema } from "@/lib/site";

const title =
  "Best Wedding Photography Portfolio in Calicut | Wedding Photography Portfolio in Kerala | Oriana Weddings";
const description =
  "Explore selected wedding photography and cinematic wedding films by Oriana Weddings — candid, traditional, intimate, pre-wedding, destination and real wedding stories.";

const trail = [
  { name: "Home", path: "/" },
  { name: "Portfolio", path: "/portfolio" },
];

const categories = [
  "Real Weddings",
  "Candid Photography",
  "Traditional Weddings",
  "Intimate Weddings",
  "Pre-Wedding",
  "Wedding Films",
  "Destination Weddings",
  "Featured Stories",
];

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema(trail)),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Wedding Photography Portfolio — Oriana Weddings",
          url: `${SITE_URL}/portfolio`,
          about: categories,
        }),
      },
    ],
  }),
  component: PortfolioIndexPage,
});

function PortfolioIndexPage() {
  return (
    <>
      <Breadcrumbs trail={trail} />
      <PageHero
        eyebrow="Portfolio · Calicut · Kerala"
        title={
          <>
            Our wedding <em>stories.</em>
          </>
        }
        lede="Every wedding is different. Every family is different. Every celebration leaves behind its own story. A selection of weddings managed by Oriana across Kerala, Gujarat and beyond."
        image={gallery.beach.src}
        imageAlt={gallery.beach.alt}
        imageWidth={gallery.beach.width}
        imageHeight={gallery.beach.height}
      />

      <section className="shell pb-6">
        <Reveal>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-5">
            {categories.map((category) => (
              <li
                key={category}
                className="text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground"
              >
                {category}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="shell py-16 md:py-24">
        <SectionHeading
          index="01"
          eyebrow="Real weddings"
          title={
            <>
              Selected <em>wedding stories</em>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            Each story records the couple, the venue, the location, the wedding type and the coverage
            Oriana managed — the same information a family asks for when they begin planning.
          </p>
        </SectionHeading>

        <div className="mt-16 grid gap-x-8 gap-y-20 md:grid-cols-2">
          {weddings.map((wedding, index) => {
            const frame = gallery[wedding.cover];
            return (
              <Reveal key={wedding.slug} delay={(index % 2) * 0.08}>
                <Link
                  to="/portfolio/real-weddings/$slug"
                  params={{ slug: wedding.slug }}
                  className="group block"
                >
                  <ImageReveal
                    src={frame.src}
                    alt={frame.alt}
                    width={frame.width}
                    height={frame.height}
                    ratio={index % 3 === 0 ? "16 / 11" : "4 / 5"}
                  />
                  <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-border pt-5">
                    <div>
                      <h2 className="font-display text-2xl">{wedding.title}</h2>
                      <p className="mt-1 text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">
                        {wedding.category} · {wedding.location}
                      </p>
                    </div>
                    <span className="shrink-0 text-[0.62rem] tracking-[0.22em] uppercase transition-colors group-hover:text-champagne">
                      View story →
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="shell py-20 md:py-28">
          <Reveal>
            <Eyebrow>Venue coverage</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display-md mt-5 max-w-3xl">
              Planning a wedding at a specific venue? We have probably worked the light there
              before.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Church weddings in Calicut, Hindu ceremonies in Kozhikode and Malappuram, nikah
              coverage, backwater and beach venues in Kerala, banquet weddings in Ahmedabad and
              destination weddings across India — tell us the venue and we will tell you how we would
              cover it.
            </p>
          </Reveal>
        </div>
      </section>

      <ClosingCta
        title={
          <>
            Ready to tell <em>your story?</em>
          </>
        }
        lede="Send us your date, venue and functions. Oriana will build the right team around your wedding."
        whatsappMessage="Hello Oriana Weddings, I saw your portfolio and would like to discuss my wedding."
      />
    </>
  );
}
