import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Lightbox } from "@/components/site/Lightbox";
import { Reveal } from "@/components/site/Reveal";
import { ResponsiveImage } from "@/lib/images";
import { getImage } from "@/lib/image-manifest";
import { getWedding } from "@/lib/cms";
import { photoAlt, type Photo } from "@/lib/photos";
import { business } from "@/lib/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/portfolio/real-weddings/$slug")({
  loader: async ({ params }) => {
    const wedding = await getWedding(params.slug);
    if (!wedding) throw notFound();
    return { wedding };
  },
  head: ({ loaderData }) => {
    const wedding = loaderData!.wedding;
    return seo({
      title: wedding.seoTitle ?? `${wedding.couple} — Wedding Story | ${business.name}`,
      description: wedding.seoDescription ?? wedding.summary,
      path: `/portfolio/real-weddings/${wedding.slug}`,
      image: getImage(wedding.cover).src,
    });
  },
  component: StoryPage,
});

function StoryPage() {
  const { wedding } = Route.useLoaderData();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos: Photo[] = wedding.frames.map((key) => ({
    key,
    alt: photoAlt(key) ?? `${wedding.couple} wedding photography`,
  }));

  return (
    <main className="story-page">
      <header className="story-detail-head">
        <Link to="/wedding-photography" className="story-back">
          ← All stories
        </Link>
        <p className="story-card-kicker">
          {wedding.type} · {wedding.location}
        </p>
        <h1>{wedding.couple}</h1>
        <p className="story-detail-summary">{wedding.summary}</p>
      </header>
      <section className="story-gallery" aria-label={`${wedding.couple} wedding photographs`}>
        {photos.map((photo, index) => (
          <Reveal key={`${photo.key}-${index}`} className={index === 0 ? "story-gallery-lead" : ""}>
            <button
              type="button"
              onClick={() => setLightbox(index)}
              className="block w-full cursor-zoom-in"
              aria-label={`View ${photo.alt} full-screen`}
            >
              <ResponsiveImage
                image={photo.key}
                alt={photo.alt}
                sizes="(min-width: 900px) 48vw, 100vw"
                zoom
              />
            </button>
          </Reveal>
        ))}
      </section>
      <footer className="story-detail-footer">
        <p>
          {wedding.venue} · {wedding.location}
        </p>
        <Link to="/wedding-photography" className="story-back">
          ← All photography stories
        </Link>
      </footer>
      {lightbox !== null ? (
        <Lightbox
          photos={photos}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onStep={setLightbox}
        />
      ) : null}
    </main>
  );
}
