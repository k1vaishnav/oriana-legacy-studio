import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Breadcrumbs, ClosingCta, Eyebrow } from "@/components/site/Blocks";
import { ImageReveal, Reveal } from "@/components/site/Reveal";
import { findWedding, gallery, weddings } from "@/lib/portfolio";
import { SITE_URL, breadcrumbSchema } from "@/lib/site";

export const Route = createFileRoute("/portfolio/real-weddings/$slug")({
  loader: ({ params }) => {
    const wedding = findWedding(params.slug);
    if (!wedding) throw notFound();
    const index = weddings.findIndex((item) => item.slug === wedding.slug);
    return {
      wedding,
      next: weddings[(index + 1) % weddings.length]!,
    };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Wedding story not found — Oriana Weddings" }, { name: "robots", content: "noindex" }],
      };
    }
    const { wedding } = loaderData;
    const title = `${wedding.title} — ${wedding.location} Wedding Photography | Oriana Weddings`;
    return {
      meta: [
        { title },
        { name: "description", content: wedding.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: wedding.summary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/portfolio/real-weddings/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/portfolio/real-weddings/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Portfolio", path: "/portfolio" },
              { name: wedding.title, path: `/portfolio/real-weddings/${wedding.slug}` },
            ]),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: wedding.title,
            description: wedding.summary,
            about: wedding.services,
            locationCreated: { "@type": "Place", name: wedding.location },
            author: { "@type": "Organization", name: "Oriana Weddings", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Oriana Weddings", url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}/portfolio/real-weddings/${wedding.slug}`,
          }),
        },
      ],
    };
  },
  component: WeddingStoryPage,
});

function WeddingStoryPage() {
  const { wedding, next } = Route.useLoaderData();
  const cover = gallery[wedding.cover];
  const trail = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: wedding.title, path: `/portfolio/real-weddings/${wedding.slug}` },
  ];

  return (
    <>
      <Breadcrumbs trail={trail} />
      <article className="pb-8">
        <header className="shell pt-16 pb-14 md:pt-24">
          <Reveal>
            <Eyebrow>
              {wedding.category} · {wedding.location} · {wedding.season}
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-lg mt-6 max-w-4xl">{wedding.title}</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {wedding.summary}
            </p>
          </Reveal>
        </header>

        <div className="overflow-hidden bg-secondary">
          <img
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            className="h-[48vh] w-full object-cover md:h-[72vh]"
          />
        </div>

        <div className="shell grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <aside className="md:col-span-3">
            <Reveal>
              <h2 className="eyebrow border-b border-border pb-4">The details</h2>
            </Reveal>
            <dl className="mt-6 space-y-6 text-sm">
              <div>
                <dt className="text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
                  Location
                </dt>
                <dd className="mt-1">{wedding.location}</dd>
              </div>
              <div>
                <dt className="text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
                  Wedding type
                </dt>
                <dd className="mt-1">{wedding.category}</dd>
              </div>
              <div>
                <dt className="text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
                  Season
                </dt>
                <dd className="mt-1">{wedding.season}</dd>
              </div>
              <div>
                <dt className="text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
                  Coverage managed by Oriana
                </dt>
                <dd className="mt-2 space-y-1">
                  {wedding.services.map((service) => (
                    <div key={service}>{service}</div>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>

          <div className="space-y-8 text-base leading-relaxed text-muted-foreground md:col-span-8 md:col-start-5">
            {wedding.story.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.06}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
            <Reveal delay={0.24}>
              <p className="text-foreground">
                Our team focused on capturing genuine emotions while creating elegant portraits and
                cinematic visuals that reflected the atmosphere of the celebration.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="shell grid gap-8 md:grid-cols-2">
          {wedding.frames
            .filter((frame) => frame !== wedding.cover)
            .map((frameKey, index) => {
              const frame = gallery[frameKey];
              return (
                <ImageReveal
                  key={frameKey}
                  src={frame.src}
                  alt={frame.alt}
                  width={frame.width}
                  height={frame.height}
                  ratio={index % 2 === 0 ? "4 / 3" : "4 / 5"}
                />
              );
            })}
        </div>

        <nav className="shell mt-20 border-t border-border pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Link
              to="/portfolio"
              className="text-[0.62rem] tracking-[0.22em] uppercase text-muted-foreground transition-colors hover:text-foreground"
            >
              ← All wedding stories
            </Link>
            <Link
              to="/portfolio/real-weddings/$slug"
              params={{ slug: next.slug }}
              className="text-[0.62rem] tracking-[0.22em] uppercase transition-colors hover:text-champagne"
            >
              Next story · {next.title} →
            </Link>
          </div>
        </nav>
      </article>

      <ClosingCta
        title={
          <>
            Planning a wedding in <em>{wedding.location.split(",")[0]}?</em>
          </>
        }
        lede="Let Oriana Weddings manage your photography and filmmaking — from team selection to final delivery."
        whatsappMessage={`Hello Oriana Weddings, I saw the ${wedding.title} story and would like to enquire about my wedding.`}
      />
    </>
  );
}
