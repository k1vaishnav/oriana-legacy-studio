import { createFileRoute } from "@tanstack/react-router";

import { Reveal, ImageReveal } from "@/components/site/Reveal";
import {
  Breadcrumbs,
  ClosingCta,
  Eyebrow,
  PageHero,
  SectionHeading,
  TextLink,
} from "@/components/site/Blocks";
import { SITE_URL, breadcrumbSchema, coverage } from "@/lib/site";
import { gallery } from "@/lib/portfolio";

const title = "Wedding Photography in Kozhikode, Calicut — Oriana Weddings";
const description =
  "Candid and traditional wedding photography in Kozhikode (Calicut), Kerala. Pre-wedding, post-wedding and destination coverage by Oriana Weddings since 1996.";

const trail = [
  { name: "Home", path: "/" },
  { name: "Wedding Photography", path: "/wedding-photography" },
];

const faqs = [
  {
    q: "How much does wedding photography cost in Kozhikode?",
    a: "Every wedding is quoted individually because coverage depends on the number of events, days, locations and the team required. Share your dates and venues and we will send a detailed coverage plan with pricing.",
  },
  {
    q: "What is the difference between candid and traditional wedding photography?",
    a: "Candid photography is unposed documentary work — emotion, reactions and moments as they happen. Traditional photography is composed: formal portraits, family groups and complete ritual coverage. Most of our couples book both, delivered as one album.",
  },
  {
    q: "How many photographers cover a wedding?",
    a: "A typical single-day Kerala wedding is covered by two photographers. Multi-event or multi-venue weddings are covered by larger teams, with cinematographers and a drone operator as needed.",
  },
  {
    q: "When do we receive our photographs?",
    a: "A curated preview set is shared within a week. The full edited gallery is delivered in four to six weeks, with the designed album following after your selections.",
  },
  {
    q: "Do you travel outside Kerala for weddings?",
    a: "Yes. Alongside Kozhikode, Malappuram and Wayanad, we regularly photograph weddings in Ahmedabad, Chennai, Mumbai and destination venues across India.",
  },
];

export const Route = createFileRoute("/wedding-photography")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE_URL}/wedding-photography` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/wedding-photography` }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema(trail)) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Wedding photography",
          serviceType: "Wedding photography",
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: coverage.map((name) => ({ "@type": "Place", name })),
          url: `${SITE_URL}/wedding-photography`,
        }),
      },
    ],
  }),
  component: PhotographyPage,
});

const disciplines = [
  {
    index: "01",
    name: "Candid wedding photography",
    copy: "Documentary coverage of the whole day — reactions, tears, the cousins in the corner. Nothing staged, nothing interrupted.",
    frame: gallery.candid,
    ratio: "3 / 4",
  },
  {
    index: "02",
    name: "Traditional wedding photography",
    copy: "Composed portraiture and complete ritual coverage, with formal family groups made properly and calmly.",
    frame: gallery.church,
    ratio: "4 / 3",
  },
  {
    index: "03",
    name: "Pre-wedding photography",
    copy: "A shoot built around a place that means something to you — a tea estate at sunrise, a city at night, a shoreline.",
    frame: gallery.wayanad,
    ratio: "16 / 10",
  },
  {
    index: "04",
    name: "Post-wedding photography",
    copy: "The session the wedding day never allows time for. Unhurried portraits, golden light, just the two of you.",
    frame: gallery.beach,
    ratio: "4 / 3",
  },
];

const process = [
  { step: "01", label: "Conversation", copy: "We learn your dates, venues, families and what you care about most." },
  { step: "02", label: "Coverage plan", copy: "A written plan: team size, events, hours, deliverables and pricing." },
  { step: "03", label: "The wedding", copy: "We arrive early, work quietly and stay until the last send-off." },
  { step: "04", label: "The edit", copy: "Colour-graded selections, curated gallery, and a designed album." },
];

function PhotographyPage() {
  return (
    <>
      <Breadcrumbs trail={trail} />
      <PageHero
        eyebrow="Wedding photography"
        title={
          <>
            Photographs that hold <em className="not-italic">the feeling.</em>
          </>
        }
        lede="Candid and traditional wedding photography in Kozhikode, Calicut and across Kerala — plus pre-wedding, post-wedding and destination coverage."
        image={gallery.details.src}
        imageAlt={gallery.details.alt}
        imageWidth={gallery.details.width}
        imageHeight={gallery.details.height}
      />

      <section className="shell py-20 md:py-28">
        {disciplines.map((discipline, index) => (
          <div
            key={discipline.name}
            className={`grid gap-10 border-t border-border py-16 md:grid-cols-12 md:py-24 ${
              index % 2 === 1 ? "md:[&>figure]:order-2" : ""
            }`}
          >
            <ImageReveal
              className="md:col-span-6"
              src={discipline.frame.src}
              alt={discipline.frame.alt}
              width={discipline.frame.width}
              height={discipline.frame.height}
              ratio={discipline.ratio}
            />
            <div className="md:col-span-5 md:col-start-8 md:pt-8">
              <Reveal>
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-2xl text-champagne">{discipline.index}</span>
                  <h2 className="display-sm">{discipline.name}</h2>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  {discipline.copy}
                </p>
                <div className="mt-8">
                  <TextLink to="/portfolio">See this work</TextLink>
                </div>
              </Reveal>
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="shell py-20 md:py-28">
          <Reveal>
            <Eyebrow>How a booking works</Eyebrow>
            <h2 className="display-md mt-4">From first message to final album.</h2>
          </Reveal>
          <div className="mt-16 grid gap-10 md:grid-cols-4">
            {process.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.08}>
                <p className="font-display text-3xl text-champagne">{item.step}</p>
                <h3 className="mt-4 border-t border-foreground/20 pt-4 text-[0.66rem] tracking-[0.24em] uppercase">
                  {item.label}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHeading index="05" eyebrow="Questions" title="Wedding photography, answered.">
          <p className="text-sm leading-relaxed text-muted-foreground">
            The questions couples ask us most often before booking. Anything else, just message the
            studio.
          </p>
        </SectionHeading>
        <div className="mt-14 border-t border-border">
          {faqs.map((faq, index) => (
            <Reveal key={faq.q} delay={index * 0.05}>
              <details className="group border-b border-border py-7">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6">
                  <h3 className="font-display text-xl md:text-2xl">{faq.q}</h3>
                  <span
                    aria-hidden
                    className="mt-1 text-champagne transition-transform duration-500 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <ClosingCta
        title={
          <>
            Let's photograph <em>your wedding.</em>
          </>
        }
        lede="Send us your dates and venues — we'll confirm availability and share a coverage plan."
        whatsappMessage="Hello Oriana Weddings, I would like to enquire about wedding photography coverage."
      />
    </>
  );
}
