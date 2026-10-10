import { Link } from "@tanstack/react-router";

import { weddings as localWeddings, type Wedding } from "@/lib/portfolio";
import { PhotoImage } from "@/lib/images";

/** Four featured stories — CMS weddings when configured, else the built-in four. */
export function FeaturedWeddingStories({ weddings = localWeddings }: { weddings?: Wedding[] }) {
  const featuredStories = weddings.slice(0, 4);
  return (
    <section className="featured-stories" aria-label="Featured wedding stories">
      <div className="featured-stories-grid">
        {featuredStories.map((wedding) => (
          <article className="featured-story" key={wedding.slug}>
            <Link
              to="/portfolio/real-weddings/$slug"
              params={{ slug: wedding.slug }}
              className="featured-story-link"
              aria-label={`Read ${wedding.couple}'s wedding story`}
            >
              <PhotoImage
                photo={wedding.cover}
                ratio="3 / 4"
                sizes="(min-width: 1200px) 22vw, (min-width: 700px) 46vw, 88vw"
                className="featured-story-image"
              />
              <h2>{wedding.couple}</h2>
              <p>{wedding.location}</p>
            </Link>
          </article>
        ))}
      </div>
      <Link to="/wedding-photography" className="featured-stories-button">
        Photography Blog
      </Link>
    </section>
  );
}
