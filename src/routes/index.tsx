import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";

import { Reveal, ImageReveal } from "@/components/site/Reveal";
import {
  ClosingCta,
  Eyebrow,
  SectionHeading,
  TextLink,
  Placeholder,
} from "@/components/site/Blocks";
import { FilmFrame } from "@/components/site/FilmFrame";
import { SITE_URL, business, coverage } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

import heroImage from "@/assets/oriana-weddings-calicut-cinematic-wedding-hero.jpg";
import candidImage from "@/assets/oriana-weddings-kozhikode-candid-bridal-moment.jpg";
import churchImage from "@/assets/oriana-weddings-calicut-church-wedding-ceremony.jpg";
import wayanadImage from "@/assets/oriana-weddings-wayanad-pre-wedding-shoot.jpg";
import filmStill from "@/assets/oriana-weddings-kerala-cinematic-wedding-film-still.jpg";
import detailsImage from "@/assets/oriana-weddings-kerala-wedding-details-jasmine-gold.jpg";
import beachImage from "@/assets/oriana-weddings-kozhikode-beach-post-wedding-portrait.jpg";
import aerialImage from "@/assets/oriana-weddings-kerala-drone-wedding-venue-aerial.jpg";

const title = "Oriana Weddings — Wedding Photography & Films in Kozhikode, Kerala";
const description =
  "Story-driven wedding photography and cinematic wedding films from Oriana Weddings, a studio based in Kozhikode (Calicut), Kerala. Photographing weddings since 1996.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Wedding photography and wedding films",
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: ["Kozhikode", "Malappuram", "Wayanad", "Kerala"],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Wedding coverage",
            itemListElement: [
              "Candid wedding photography",
              "Traditional wedding photography",
              "Pre-wedding photography",
              "Post-wedding photography",
              "Cinematic wedding films",
              "Wedding teasers",
            ].map((name) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name },
            })),
          },
        }),
      },
    ],
  }),
  component: HomePage,
});

const stories = [
  {
    title: "[REAL WEDDING TITLE]",
    location: "Kozhikode, Kerala",
    image: churchImage,
    alt: "Bride and groom exchanging rings during a church wedding ceremony in Calicut, photographed by Oriana Weddings",
    width: 1408,
    height: 1008,
  },
  {
    title: "[REAL WEDDING TITLE]",
    location: "Wayanad, Kerala",
    image: wayanadImage,
    alt: "Couple standing on a misty Wayanad tea estate during a pre-wedding shoot at sunrise",
    width: 1600,
    height: 1008,
  },
  {
    title: "[REAL WEDDING TITLE]",
    location: "Malappuram, Kerala",
    image: candidImage,
    alt: "Bride laughing with her sisters while getting ready for a Kerala wedding in Kozhikode",
    width: 1024,
    height: 1408,
  },
];

const principles = [
  {
    label: "The moment",
    copy: "We watch for the unrepeatable — a glance held a second too long, a hand steadied before the vows.",
  },
  {
    label: "The people",
    copy: "Families, friends, the ones who travelled far. A wedding is a room full of love, not two people alone.",
  },
  {
    label: "The details",
    copy: "Jasmine, gold, folded silk, the light in a courtyard at four in the afternoon. Atmosphere is memory.",
  },
  {
    label: "The story",
    copy: "Photographs and films edited as one narrative, so the day reads the way it felt to live it.",
  },
];

function HomePage() {
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative isolate flex min-h-[92vh] flex-col justify-end overflow-hidden">
        <motion.img
          src={heroImage}
          alt="Kerala bride and groom in traditional cream and gold attire walking through a sunlit courtyard in Calicut, photographed by Oriana Weddings"
          width={1920}
          height={1280}
          fetchPriority="high"
          decoding="async"
          sizes="100vw"
          className="absolute inset-0 -z-10 size-full object-cover"
          initial={reduced ? false : { scale: 1.08 }}
          animate={reduced ? {} : { scale: 1 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/70 via-ink/15 to-ink/25"
        />

        <div className="shell pb-16 pt-40 md:pb-24">
          <motion.p
            className="text-[0.62rem] tracking-[0.42em] uppercase text-background/80"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Kozhikode · Kerala
          </motion.p>

          <h1 className="mt-8 max-w-4xl">
            {["Weddings,", "told beautifully."].map((line, index) => (
              <motion.span
                key={line}
                className="display-xl block text-background"
                initial={reduced ? false : { opacity: 0, y: 40 }}
                animate={reduced ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.32 + index * 0.14, ease: [0.16, 1, 0.3, 1] }}
              >
                {index === 1 ? <em className="not-italic">{line}</em> : line}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="mt-12 flex flex-col gap-8 border-t border-background/25 pt-8 md:flex-row md:items-end md:justify-between"
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? {} : { opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
          >
            <p className="max-w-sm text-sm leading-relaxed text-background/85">
              Wedding photography and cinematic films crafted in Calicut, Kerala.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/portfolio"
                className="border border-background/70 bg-background/95 px-8 py-4 text-center text-[0.62rem] tracking-[0.28em] uppercase text-foreground transition-colors hover:bg-transparent hover:text-background"
              >
                View our work
              </Link>
              <Link
                to="/contact"
                className="border border-background/70 px-8 py-4 text-center text-[0.62rem] tracking-[0.28em] uppercase text-background transition-colors hover:bg-background/95 hover:text-foreground"
              >
                Plan your wedding
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Editorial statement */}
      <section className="shell py-24 md:py-36">
        <Reveal>
          <p className="display-md max-w-4xl">
            Oriana Weddings is a wedding photography and film studio based in Kozhikode,
            Kerala — creating photographs and films that preserve{" "}
            <em>the feeling of the day.</em>
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-10 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {business.tagline}
          </p>
        </Reveal>
      </section>

      {/* Featured stories */}
      <section className="shell border-t border-border py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <Eyebrow>Featured stories</Eyebrow>
            <h2 className="display-md mt-4">Weddings we have lived through.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <TextLink to="/portfolio">All wedding stories</TextLink>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <StoryCard story={stories[0]!} ratio="4 / 3" />
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-24">
            <StoryCard story={stories[2]!} ratio="3 / 4" />
          </div>
          <div className="md:col-span-9 md:col-start-3">
            <StoryCard story={stories[1]!} ratio="16 / 9" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-border">
        <div className="shell grid gap-16 py-20 md:grid-cols-2 md:gap-10 md:py-28">
          <ServiceBlock
            index="01"
            title="Wedding photography"
            items={["Candid", "Traditional", "Pre-wedding", "Post-wedding"]}
            to="/wedding-photography"
            cta="Explore photography"
            image={detailsImage}
            alt="Jasmine flowers and gold bangles arranged on silk, a Kerala wedding detail photographed by Oriana Weddings"
            width={1200}
            height={1200}
            ratio="1 / 1"
          />
          <ServiceBlock
            index="02"
            title="Wedding films"
            items={["Cinematic films", "Wedding teasers", "Storytelling", "Save-the-date films"]}
            to="/wedding-films"
            cta="Explore films"
            image={filmStill}
            alt="Cinematic wedding film still of a bride's veil catching evening light at a Kerala reception"
            width={1920}
            height={1088}
            ratio="1 / 1"
          />
        </div>
      </section>

      {/* Approach */}
      <section className="border-t border-border bg-secondary/40">
        <div className="shell py-24 md:py-36">
          <Reveal>
            <Eyebrow>The Oriana approach</Eyebrow>
            <p className="display-lg mt-8 max-w-4xl">
              We don't just photograph the wedding.
              <br />
              <em>We preserve how it felt.</em>
            </p>
          </Reveal>
          <div className="mt-20 grid gap-12 md:grid-cols-4">
            {principles.map((principle, index) => (
              <Reveal key={principle.label} delay={index * 0.08}>
                <h3 className="border-t border-foreground/20 pt-5 text-[0.66rem] tracking-[0.24em] uppercase">
                  {principle.label}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {principle.copy}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured film */}
      <section className="shell py-24 md:py-32">
        <Reveal>
          <Eyebrow>Featured wedding film</Eyebrow>
          <h2 className="display-md mt-4 max-w-2xl">A day, in motion.</h2>
        </Reveal>
        <Reveal delay={0.12} className="mt-12">
          <FilmFrame
            poster={filmStill}
            alt="Still frame from a cinematic Kerala wedding film by Oriana Weddings"
            title="[FEATURED WEDDING FILM]"
            width={1920}
            height={1088}
          />
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10">
            <TextLink to="/wedding-films">See our cinematic wedding films</TextLink>
          </div>
        </Reveal>
      </section>

      {/* Why Oriana */}
      <section className="border-t border-border">
        <div className="shell py-20 md:py-28">
          <SectionHeading eyebrow="Why Oriana" title="A studio, not a package.">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Oriana Weddings has been photographing weddings since 1996, led by director{" "}
              {business.director}. Photography and film sit under one creative direction, so
              nothing about your day is covered twice and nothing is missed.
            </p>
          </SectionHeading>
          <ul className="mt-16 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "Story-driven photography",
              "Cinematic wedding films",
              "Kerala wedding experience",
              "Personal creative direction",
              "Full wedding storytelling",
            ].map((point, index) => (
              <Reveal as="li" key={point} delay={index * 0.06}>
                <span className="font-display text-sm text-champagne">
                  0{index + 1}
                </span>
                <p className="mt-3 border-t border-border pt-4 text-sm">{point}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Location */}
      <section className="border-t border-border">
        <div className="shell grid gap-14 py-20 md:grid-cols-12 md:py-28">
          <Reveal className="md:col-span-5">
            <h2 className="display-lg">
              From Calicut,
              <br />
              <em>across Kerala.</em>
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Our studio sits on Cherooty Road in Kozhikode. From there we travel to
              backwater venues, hill churches, family homes and city banquet halls — and to
              destination weddings further afield.
            </p>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[0.62rem] tracking-[0.22em] uppercase text-muted-foreground">
              {coverage.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
          </Reveal>
          <ImageReveal
            className="md:col-span-6 md:col-start-7"
            src={aerialImage}
            alt="Aerial view of a riverside Kerala wedding venue with tiled roofs and coconut palms in morning haze"
            width={1600}
            height={1000}
            ratio="16 / 10"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-secondary/40">
        <div className="shell py-20 md:py-28">
          <Reveal>
            <Eyebrow>In their words</Eyebrow>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Reveal key={index} delay={index * 0.08}>
                <blockquote className="flex h-full flex-col justify-between border-t border-foreground/20 pt-6">
                  <p className="font-display text-2xl leading-snug text-muted-foreground">
                    “Client testimonial to be added here once supplied by Oriana Weddings.”
                  </p>
                  <footer className="mt-8">
                    <Placeholder label="[REAL TESTIMONIAL]" />
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="shell border-t border-border py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <Eyebrow>Latest frames</Eyebrow>
            <h2 className="display-md mt-4">On Instagram.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={business.instagram}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("instagram_click", { location: "home_feed" })}
              className="border-b border-foreground/30 pb-1 text-[0.66rem] tracking-[0.22em] uppercase transition-colors hover:border-champagne hover:text-champagne"
            >
              Follow @orianaweddings
            </a>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            {
              src: detailsImage,
              alt: "Jasmine and gold bridal jewellery detail on silk fabric",
              w: 1200,
              h: 1200,
            },
            {
              src: beachImage,
              alt: "Silhouetted couple holding hands on a Kozhikode beach at dusk",
              w: 1400,
              h: 1000,
            },
            {
              src: candidImage,
              alt: "Candid moment between a Kerala bride and her sisters before the ceremony",
              w: 1024,
              h: 1408,
            },
            {
              src: wayanadImage,
              alt: "Pre-wedding portrait on a misty Wayanad hillside",
              w: 1600,
              h: 1008,
            },
          ].map((item) => (
            <div key={item.alt} className="group aspect-square overflow-hidden bg-secondary">
              <img
                src={item.src}
                alt={item.alt}
                width={item.w}
                height={item.h}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 50vw, 25vw"
                className="img-cover group-hover:scale-[1.05]"
              />
            </div>
          ))}
        </div>
      </section>

      <ClosingCta
        title={
          <>
            Let's tell <em>your story.</em>
          </>
        }
        lede="Tell us your dates, your venue and how you imagine remembering the day. We reply personally."
      />
    </>
  );
}

function StoryCard({
  story,
  ratio,
}: {
  story: (typeof stories)[number];
  ratio: string;
}) {
  return (
    <Link to="/portfolio" className="group block">
      <ImageReveal
        src={story.image}
        alt={story.alt}
        width={story.width}
        height={story.height}
        ratio={ratio}
      />
      <div className="mt-5 flex items-end justify-between gap-6 border-t border-border pt-4">
        <div>
          <h3 className="font-display text-2xl">{story.title}</h3>
          <p className="mt-1 text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">
            {story.location}
          </p>
        </div>
        <span className="text-[0.62rem] tracking-[0.2em] uppercase transition-colors group-hover:text-champagne">
          View story →
        </span>
      </div>
    </Link>
  );
}

function ServiceBlock({
  index,
  title: blockTitle,
  items,
  to,
  cta,
  image,
  alt,
  width,
  height,
  ratio,
}: {
  index: string;
  title: string;
  items: string[];
  to: "/wedding-photography" | "/wedding-films";
  cta: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  ratio: string;
}) {
  return (
    <Reveal>
      <ImageReveal src={image} alt={alt} width={width} height={height} ratio={ratio} />
      <div className="mt-8 flex items-baseline gap-5">
        <span className="font-display text-2xl text-champagne">{index}</span>
        <h2 className="display-md">{blockTitle}</h2>
      </div>
      <ul className="mt-8 space-y-3 border-t border-border pt-6">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <TextLink to={to}>{cta}</TextLink>
      </div>
    </Reveal>
  );
}
