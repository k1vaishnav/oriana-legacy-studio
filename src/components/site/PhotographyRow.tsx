import { Link } from "@tanstack/react-router";
import { ResponsiveImage } from "@/lib/images";
import { originals, ceremonies, portraits } from "@/lib/photos";
import type { Photo } from "@/lib/photos";

type PhotoFilter = "candid" | "traditional" | "intimate" | "pre";

const COLLECTIONS: readonly {
  id: PhotoFilter;
  title: string;
  photo: Photo;
}[] = [
  { id: "candid", title: "Candid", photo: originals[4]! },
  { id: "traditional", title: "Traditional", photo: ceremonies[0]! },
  { id: "intimate", title: "Intimate", photo: portraits[8]! },
  { id: "pre", title: "Pre-wedding", photo: originals[3]! },
];

export function PhotographyRow() {
  return (
    <section
      id="photography-collections"
      className="photography-collections"
      aria-labelledby="collections-heading"
    >
      <h2 id="collections-heading" className="sr-only">
        Wedding photography collections
      </h2>
      <div className="photography-collections-grid">
        {COLLECTIONS.map((item, index) => (
          <Link
            key={item.id}
            to="/wedding-photography"
            search={{ filter: item.id }}
            className="photography-collection"
            aria-label={`View ${item.title} wedding photography`}
          >
            <ResponsiveImage
              image={item.photo.key}
              alt={item.photo.alt}
              ratio="2 / 3"
              sizes="(min-width: 900px) 25vw, 50vw"
              className="photography-collection-image"
            />
            <span className="photography-collection-title">
              <span className="photography-collection-index">0{index + 1}</span>
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
