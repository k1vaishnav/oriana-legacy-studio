import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs, ClosingCta, PageHero, SectionHeading } from "@/components/site/Blocks";
import { Reveal } from "@/components/site/Reveal";
import { gallery } from "@/lib/portfolio";
import { SITE_URL, breadcrumbSchema } from "@/lib/site";

const title =
  "Wedding Photography Packages in Calicut | Wedding Photography Packages in Kerala | Oriana Weddings";
const description =
  "Explore flexible wedding photography packages from Oriana Weddings, designed around your functions, coverage requirements, team size and preferred deliverables.";

const trail = [
  { name: "Home", path: "/" },
  { name: "Wedding Photography", path: "/wedding-photography" },
  { name: "Packages", path: "/wedding-photography-packages" },
];

const coverage = [
  "Wedding day photography",
  "Reception photography",
  "Engagement photography",
  "Candid photography",
  "Traditional photography",
  "Intimate wedding photography",
  "Pre-wedding photography",
  "Post-wedding photography",
  "Haldi photography",
  "Mehendi photography",
  "Nikah photography",
  "Destination wedding photography",
  "Confidential wedding photography",
];

const deliverables = [
  "Edited photographs",
  "RAW files",
  "Premium albums",
  "Highlight films",
  "Reels",
  "Full wedding films",
];

const variables = [
  {
    label: "Functions",
    detail:
      "Engagement, haldi, mehendi, nikah, wedding day, reception, pre-wedding and post-wedding sessions — covered individually or as one continuous package.",
  },
  {
    label: "Team size",
    detail:
      "The number of photographers, cinematographers, drone operators and assistants is set by the scale of the wedding, not by a fixed tier.",
  },
  {
    label: "Deliverables",
    detail:
      "Edited photographs, RAW files, premium albums, teasers, highlight films, reels and full wedding films in the combination you actually want.",
  },
  {
    label: "Locations",
    detail:
      "Calicut and across Kerala, Ahmedabad and Gujarat, other Indian cities, and destination or international weddings.",
  },
];

export const Route = createFileRoute("/wedding-photography-packages")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/wedding-photography-packages" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/wedding-photography-packages" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema(trail)) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Wedding Photography Packages",
          serviceType: "Wedding photography and wedding film packages",
          provider: { "@type": "LocalBusiness", name: "Oriana Weddings", url: SITE_URL },
          areaServed: ["Calicut", "Kozhikode", "Kerala", "Ahmedabad", "Gujarat", "India"].map(
            (name) => ({ "@type": "Place", name }),
          ),
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Coverage options",
            itemListElement: coverage.map((item) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: item },
            })),
          },
        }),
      },
    ],
  }),
  component: PackagesPage,
});

function PackagesPage() {
  return (
    <>
      <Breadcrumbs trail={trail} />
      <PageHero
        eyebrow="Packages · Calicut · Kerala"
        title={
          <>
            Packages designed around <em>your requirements.</em>
          </>
        }
        lede="No two weddings require exactly the same coverage. Your package is structured around your functions, your team size, your deliverables and your locations."
        image={gallery.church.src}
        imageAlt={gallery.church.alt}
        imageWidth={gallery.church.width}
        imageHeight={gallery.church.height}
      />

      <section className="shell py-20 md:py-28">
        <SectionHeading
          index="01"
          eyebrow="What shapes a proposal"
          title={
            <>
              Four variables, <em>not four tiers.</em>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            We do not publish fixed bronze/silver/gold packages, because weddings do not arrive in
            those shapes. Tell us the wedding and we will design the coverage and the price around
            it.
          </p>
        </SectionHeading>

        <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {variables.map((item, index) => (
            <Reveal key={item.label} delay={(index % 2) * 0.08}>
              <div className="border-t border-border pt-6">
                <h3 className="font-display text-2xl">{item.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="shell grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <Reveal className="md:col-span-5">
            <h2 className="eyebrow">Possible coverage</h2>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {coverage.map((item) => (
                <li key={item} className="border-b border-border pb-2">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <h2 className="eyebrow">Possible deliverables</h2>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {deliverables.map((item) => (
                <li key={item} className="border-b border-border pb-2">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              Your proposal and terms clearly explain the agreed services, deliverables and
              applicable terms — so there are no unexpected charges outside what you approved.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-block border border-foreground px-8 py-4 text-[0.62rem] tracking-[0.28em] uppercase transition-colors hover:bg-foreground hover:text-primary-foreground"
            >
              Get a proposal
            </Link>
          </Reveal>
        </div>
      </section>

      <ClosingCta
        title={
          <>
            Get a proposal designed for <em>your wedding.</em>
          </>
        }
        lede="Share your date, venue, functions and required services. We will prepare a suitable proposal."
        whatsappMessage="Hello Oriana Weddings, I would like a wedding photography package proposal."
      />
    </>
  );
}
