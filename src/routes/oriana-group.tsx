import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, ClosingCta, PageHero, SectionHeading } from "@/components/site/Blocks";
import { Reveal } from "@/components/site/Reveal";
import { gallery } from "@/lib/portfolio";
import { SITE_URL, breadcrumbSchema, groupBrands } from "@/lib/site";

const title = "Oriana Group | Oriana Weddings | Creative Brands in Calicut & Kerala";
const description =
  "Learn about the creative brands connected with the Oriana Group, including Oriana Weddings and related photography, fashion, event and luxury product services.";

const trail = [
  { name: "Home", path: "/" },
  { name: "Oriana Group", path: "/oriana-group" },
];

export const Route = createFileRoute("/oriana-group")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/oriana-group" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/oriana-group" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema(trail)),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Oriana Group",
          url: `${SITE_URL}/oriana-group`,
          description:
            "Oriana Group brings together creative brands working across photography, fashion, events and luxury products.",
          subOrganization: groupBrands.map((brand) => ({
            "@type": "Organization",
            name: brand.name,
            description: brand.description,
          })),
        }),
      },
    ],
  }),
  component: OrianaGroupPage,
});

export default function noop() {
  return null;
}

function OrianaGroupPage() {
  return (
    <>
      <Breadcrumbs trail={trail} />
      <PageHero
        eyebrow="Oriana Group"
        title={
          <>
            A creative <em>ecosystem.</em>
          </>
        }
        lede="Oriana Group brings together creative brands working across photography, fashion, events and luxury products — with Oriana Weddings at its centre."
        image={gallery.details.src}
        imageAlt={gallery.details.alt}
        imageWidth={gallery.details.width}
        imageHeight={gallery.details.height}
      />

      <section className="shell py-20 md:py-28">
        <SectionHeading
          index="01"
          eyebrow="The brands"
          title={
            <>
              Five brands, one <em>standard.</em>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            Each brand runs its own craft and its own team. What they share is the Oriana approach:
            understand the client first, then assemble the right people for the work.
          </p>
        </SectionHeading>

        <ul className="mt-16 border-t border-border">
          {groupBrands.map((brand, index) => (
            <Reveal as="li" key={brand.name} delay={index * 0.05}>
              <div className="grid gap-4 border-b border-border py-10 md:grid-cols-12 md:items-baseline">
                <span className="font-display text-2xl text-champagne md:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-3xl md:col-span-4">{brand.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">
                  {brand.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="shell grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <Reveal className="md:col-span-5">
            <h2 className="display-md">
              Wedding work stays <em>with the wedding team.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <p className="text-sm leading-relaxed text-muted-foreground">
              The group exists to widen what we can offer, not to dilute what we do. When you book
              Oriana Weddings, your wedding is managed by the wedding division in Calicut — with
              group resources available if you also need events, fashion or family photography.
            </p>
          </Reveal>
        </div>
      </section>

      <ClosingCta
        title={
          <>
            Let's talk about <em>your wedding.</em>
          </>
        }
        lede="One conversation with Oriana covers photography, films and the coordination behind both."
      />
    </>
  );
}
