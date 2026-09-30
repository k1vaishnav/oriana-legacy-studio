/** Quiet, full-bleed image introduction for the homepage. */
export function EditorialHero({ src, alt }: { src: string; alt: string }) {
  return (
    <section className="home-hero-wrap" aria-label="Oriana Weddings Hero">
      <div className="home-hero-frame">
        <h1 className="sr-only">Wedding photography and films by Oriana Weddings</h1>
        <img
          src={src}
          alt={alt}
          sizes="(min-width: 768px) 42vw, 100vw"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          className="home-hero-image"
        />
      </div>
    </section>
  );
}
