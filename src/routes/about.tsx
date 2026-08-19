import { createFileRoute } from "@tanstack/react-router";

import { Reveal, ImageReveal } from "@/components/site/Reveal";
import {
  Breadcrumbs,
  ClosingCta,
  Eyebrow,
  PageHero,
  SectionHeading,
} from "@/components/site/Blocks";
import { SITE_URL, breadcrumbSchema, business, coverage } from "@/lib/site";
import { gallery } from "@/lib/portfolio";

const title = "About Oriana Weddings — Wedding Photographers in Kozhikode, Kerala";
const description =
  "Oriana Weddings has photographed weddings since 1996 from Kozhikode (Calicut), Kerala. Meet the studio, our approach and the team behind The Oriana Legacy.";

const trail = [
  { name: "Home", path: "/" },
  { name: "About Oriana", path: "/about" },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE_URL}/about` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema(trail)),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: title,
          description,
          url: `${SITE_URL}/about`,
          about: { "@id": `${SITE_URL}/#organization` },
        }),
      },
    ],
  }),
  component: AboutPage,
});

const timeline = [
  {
    year: "1996",
    label: "The beginning",
    copy: "The studio opens in Kozhikode, photographing weddings on film across Malabar.",
  },
  {
    year: "2008",
    label: "Into cinema",
    copy: "Wedding films become a discipline of their own — story-led editing, not event recording.",
  },
  {
    year: "2016",
    label: "Beyond Kerala",
    copy: "Destination coverage expands to Ahmedabad, Chennai, Mumbai and beyond.",
  },
  {
    year: "Today",
    label: "The Oriana Legacy",
    copy: "Three decades of weddings, one standard: photographs that still move you in twenty years.",
  },
];

const values = [
  {
    title: "Unhurried",
    copy: "We never rush a ritual for a photograph. The day sets the pace; we follow it closely.",
  },
  {
    title: "Invisible",
    copy: "The best frames happen when nobody is watching us. We work quietly and stay out of the way.",
  },
  {
    title: "Editorial",
    copy: "Composition, light and restraint. No filters that will date, no trends that will not last.",
  },
  {
    title: "Complete",
    copy: "Photography, film, drone, live screening — one team, one visual language, one delivery.",
  },
];

function AboutPage() {
  return (
    <>
      <Breadcrumbs trail={trail} />
      <PageHero
        eyebrow="About the studio"
        title={
          <>
            Photographing Kerala weddings <em className="not-italic">since 1996.</em>
          </>
        }
        lede={`Oriana Weddings is a wedding photography and film studio in ${business.city}, Kerala, led by ${business.director}. Three decades of weddings, one obsession: the feeling of the day.`}
        image={gallery.hero.src}
        imageAlt={gallery.hero.alt}
        imageWidth={gallery.hero.width}
        imageHeight={gallery.hero.height}
      />

      <section className="shell py-20 md:py-28">
        <SectionHeading index="01" eyebrow="Our story" title="A studio built on trust.">
          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              We started in Kozhikode with a single camera and a simple conviction — that a wedding
              deserves to be documented with the care of a feature film and the honesty of a
              photojournalist.
            </p>
            <p>
              Since then we have photographed weddings across Kerala and India: church weddings in
              Calicut, traditional ceremonies in Malappuram, misty pre-wedding mornings in Wayanad,
              and destination celebrations from Ahmedabad to Mumbai.
            </p>
            <p>{business.tagline}</p>
          </div>
        </SectionHeading>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="shell py-20 md:py-28">
          <Reveal>
            <Eyebrow>Milestones</Eyebrow>
            <h2 className="display-md mt-4">Three decades, in four moments.</h2>
          </Reveal>
          <div className="mt-16 grid gap-10 md:grid-cols-4">
            {timeline.map((item, index) => (
              <Reveal key={item.year} delay={index * 0.08}>
                <p className="font-display text-3xl text-champagne">{item.year}</p>
                <h3 className="mt-4 border-t border-foreground/20 pt-4 text-[0.66rem] tracking-[0.24em] uppercase">
                  {item.label}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <ImageReveal
          className="md:col-span-5"
          src={gallery.candid.src}
          alt={gallery.candid.alt}
          width={gallery.candid.width}
          height={gallery.candid.height}
          ratio="3 / 4"
        />
        <div className="md:col-span-6 md:col-start-7 md:pt-10">
          <Reveal>
            <Eyebrow>How we work</Eyebrow>
            <h2 className="display-md mt-4">Four principles we never bend.</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <h3 className="text-[0.66rem] tracking-[0.24em] uppercase">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="shell py-20 md:py-28">
          <SectionHeading index="02" eyebrow="Where we work" title="Kerala, India, and wherever you marry.">
            <ul className="grid grid-cols-2 gap-y-4 text-sm text-muted-foreground">
              {coverage.map((place) => (
                <li key={place} className="border-b border-border pb-3">
                  {place}
                </li>
              ))}
            </ul>
          </SectionHeading>
        </div>
      </section>

      <ClosingCta
        title={
          <>
            Tell us about your wedding. <em>We'll listen first.</em>
          </>
        }
        lede="Share your dates, venues and what matters most to you. We'll come back with availability and a coverage plan."
        whatsappMessage="Hello Oriana Weddings, I read your About page and would like to discuss our wedding coverage."
      />
    </>
  );
}
