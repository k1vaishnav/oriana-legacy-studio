import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Lightbox } from "@/components/site/Lightbox";
import { Reveal } from "@/components/site/Reveal";
import { PhotoImage } from "@/lib/images";
import { getPortfolioPage, getWedding, photoSrc } from "@/lib/cms";
import { business } from "@/lib/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/portfolio/real-weddings/$slug")({
  loader: async ({ params }) => {
    const wedding = await getWedding(params.slug);
    if (!wedding) throw notFound();
    const page = await getPortfolioPage();
    return {
      wedding,
      storyBackLabel: page.storyBackLabel,
      storiesBackLabel: page.storiesBackLabel,
    };
  },
  head: ({ loaderData }) => {
    const wedding = loaderData!.wedding;
    return seo({
      title: wedding.seoTitle ?? `${wedding.couple} — Wedding Story | ${business.name}`,
      description: wedding.seoDescription ?? wedding.summary,
      path: `/portfolio/real-weddings/${wedding.slug}`,
      image: photoSrc(wedding.cover),
    });
  },
  component: StoryPage,
});

function StoryPage() {
  const { wedding, storyBackLabel, storiesBackLabel } = Route.useLoaderData();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos = wedding.frames;

  return (
    <main className="story-page">
      <header className="story-detail-head">
        <Link to="/wedding-photography" className="story-back">
          {storyBackLabel}
        </Link>
        <p className="story-card-kicker">
          {wedding.type} · {wedding.location}
        </p>
        <h1>{wedding.couple}</h1>
        <p className="story-detail-summary">{wedding.summary}</p>
      </header>
      <section className="story-gallery" aria-label={`${wedding.couple} wedding photographs`}>
        {photos.map((photo, index) => (
          <Reveal
            key={`${photo.key ?? "cms"}-${index}`}
            className={index === 0 ? "story-gallery-lead" : ""}
          >
            <button
              type="button"
              onClick={() => setLightbox(index)}
              className="block w-full cursor-zoom-in"
              aria-label={`View ${photo.alt} full-screen`}
            >
              <PhotoImage photo={photo} sizes="(min-width: 900px) 48vw, 100vw" zoom />
            </button>
          </Reveal>
        ))}
      </section>
      <footer className="story-detail-footer">
        <p>
          {wedding.venue} · {wedding.location}
        </p>
        <Link to="/wedding-photography" className="story-back">
          {storiesBackLabel}
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
