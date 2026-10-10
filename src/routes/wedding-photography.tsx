import { createFileRoute, Link } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { ResponsiveImage } from "@/lib/images";
import { business } from "@/lib/site";
import { getPhotographyPage, getWeddings } from "@/lib/cms";
import { photoAlt } from "@/lib/photos";
import { getImage } from "@/lib/image-manifest";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/wedding-photography")({
  loader: async () => ({ weddings: await getWeddings(), page: await getPhotographyPage() }),
  head: ({ loaderData }) =>
    seo({
      title: loaderData?.page.seoTitle || `Wedding Photography Stories | ${business.name}`,
      description:
        loaderData?.page.seoDescription ||
        "A collection of wedding photography stories from Oriana Weddings.",
      path: "/wedding-photography",
    }),
  component: PhotographyStories,
});

function PhotographyStories() {
  const { weddings } = Route.useLoaderData();
  return (
    <main className="stories-page">
      <section className="stories-board" aria-label="Wedding photography stories">
        <div className="stories-grid">
          {weddings.map((wedding, index) => (
            <Reveal key={wedding.slug} delay={Math.min(index, 5) * 0.04}>
              <article className="story-card">
                <Link
                  to="/portfolio/real-weddings/$slug"
                  params={{ slug: wedding.slug }}
                  className="story-card-link"
                >
                  <ResponsiveImage
                    image={wedding.cover}
                    alt={photoAlt(wedding.cover) ?? wedding.title}
                    ratio="4 / 5"
                    sizes="(min-width: 1100px) 19rem, (min-width: 700px) 30vw, 88vw"
                    zoom
                  />
                  <div className="story-card-copy">
                    <p className="story-card-kicker">
                      {wedding.type} · {wedding.location}
                    </p>
                    <h2>{wedding.couple}</h2>
                    <p>{wedding.summary}</p>
                    <span className="story-read">
                      Read story <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
