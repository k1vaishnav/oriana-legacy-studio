import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, ClosingCta, PageHero } from "@/components/site/Blocks";
import { Reveal } from "@/components/site/Reveal";
import { faqSchema, faqs } from "@/lib/faq";
import { gallery } from "@/lib/portfolio";
import { breadcrumbSchema } from "@/lib/site";

const title = "Wedding Photography FAQ in Calicut | Wedding Photography FAQ in Kerala | Oriana Weddings";
const description =
  "Answers to common questions about Oriana Weddings — photographer selection, wedding photography, cinematic films, privacy, destination weddings and booking.";

const trail = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema(trail)) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <Breadcrumbs trail={trail} />
      <PageHero
        eyebrow="Questions & answers"
        title={
          <>
            Everything couples <em>ask us.</em>
          </>
        }
        lede="How Oriana selects your team, what happens after the wedding, privacy, destination coverage and how proposals are prepared."
        image={gallery.candid.src}
        imageAlt={gallery.candid.alt}
        imageWidth={gallery.candid.width}
        imageHeight={gallery.candid.height}
      />

      <section className="shell py-16 md:py-24">
        <dl className="border-t border-border">
          {faqs.map((item, index) => (
            <Reveal key={item.q} delay={Math.min(index, 6) * 0.04}>
              <div className="grid gap-4 border-b border-border py-9 md:grid-cols-12">
                <dt className="font-display text-2xl md:col-span-5">{item.q}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">
                  {item.a}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      <ClosingCta
        title={
          <>
            Still have a <em>question?</em>
          </>
        }
        lede="Message us on WhatsApp with your date and venue — we usually reply the same day."
        whatsappMessage="Hello Oriana Weddings, I have a question about your wedding photography and films."
      />
    </>
  );
}
