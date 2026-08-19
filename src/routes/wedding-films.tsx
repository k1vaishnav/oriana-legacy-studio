import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import {
  Breadcrumbs,
  ClosingCta,
  Eyebrow,
  PageHero,
  SectionHeading,
} from "@/components/site/Blocks";
import { FilmFrame } from "@/components/site/FilmFrame";
import { SITE_URL, breadcrumbSchema, coverage } from "@/lib/site";
import { gallery } from "@/lib/portfolio";

const title = "Cinematic Wedding Films in Kerala — Oriana Weddings, Kozhikode";
const description =
  "Cinematic wedding films, teasers and save-the-date films from Oriana Weddings, Kozhikode (Calicut). Story-led editing, drone cinematography and live screening across Kerala.";

const trail = [
  { name: "Home", path: "/" },
  { name: "Wedding Films", path: "/wedding-films" },
];

export const Route = createFileRoute("/wedding-films")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE_URL}/wedding-films` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/wedding-films` }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema(trail)) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Cinematic wedding films",
          serviceType: "Wedding videography",
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: coverage.map((name) => ({ "@type": "Place", name })),
          url: `${SITE_URL}/wedding-films`,
        }),
      },
    ],
  }),
  component: FilmsPage,
});

const films = [
  {
    title: "The Wedding Film",
    meta: "Feature · 12–20 min",
    copy: "The full narrative of your wedding, edited as a film — sound design, real voices, real vows.",
    poster: gallery.film,
  },
  {
    title: "The Teaser",
    meta: "Teaser · 60–90 sec",
    copy: "A short, high-impact cut delivered soon after the wedding — made for sharing.",
    poster: gallery.hero,
  },
  {
    title: "Save-the-date Film",
    meta: "Pre-wedding · 2–3 min",
    copy: "Shot on location before the wedding, cut to announce your day with intent.",
    poster: gallery.wayanad,
  },
  {
    title: "Aerial & Venue Films",
    meta: "Drone · Cinematic",
    copy: "Drone cinematography that gives your venue the scale it deserves.",
    poster: gallery.aerial,
  },
];

const craft = [
  { label: "Sound first", copy: "Vows, speeches and ambient sound recorded properly — the film lives on audio." },
  { label: "Story structure", copy: "Films are structured in acts, not chronology. We edit for feeling." },
  { label: "Cinema grading", copy: "Every frame colour-graded by hand for a film look that will not date." },
  { label: "Live screening", copy: "Real-time ceremony broadcast on-site, plus photobooth for your guests." },
];

function FilmsPage() {
  return (
    <>
      <Breadcrumbs trail={trail} />
      <PageHero
        eyebrow="Wedding films"
        title={
          <>
            Your wedding, <em className="not-italic">in motion.</em>
          </>
        }
        lede="Cinematic wedding films made in Kozhikode, Kerala — feature films, teasers, save-the-date films and aerial cinematography."
        image={gallery.film.src}
        imageAlt={gallery.film.alt}
        imageWidth={gallery.film.width}
        imageHeight={gallery.film.height}
      />

      <section className="shell py-20 md:py-28">
        <SectionHeading index="01" eyebrow="Films" title="Four ways we tell the day.">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Most couples take the feature film and teaser together, with a save-the-date film shot
            months earlier. Drone coverage can be added to any package.
          </p>
        </SectionHeading>
        <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {films.map((film, index) => (
            <Reveal key={film.title} delay={index * 0.06}>
              <FilmFrame
                poster={film.poster.src}
                alt={film.poster.alt}
                title={film.title}
                meta={film.meta}
                width={film.poster.width}
                height={film.poster.height}
              />
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                {film.copy}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="shell py-20 md:py-28">
          <Reveal>
            <Eyebrow>The craft</Eyebrow>
            <p className="display-lg mt-8 max-w-3xl">
              A wedding film should feel like <em>cinema, not coverage.</em>
            </p>
          </Reveal>
          <div className="mt-16 grid gap-10 md:grid-cols-4">
            {craft.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.08}>
                <h3 className="border-t border-foreground/20 pt-5 text-[0.66rem] tracking-[0.24em] uppercase">
                  {item.label}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta
        title={
          <>
            Let's make your <em>wedding film.</em>
          </>
        }
        lede="Tell us your dates and we'll share film packages, sample work and availability."
        whatsappMessage="Hello Oriana Weddings, I would like to enquire about cinematic wedding films."
      />
    </>
  );
}
