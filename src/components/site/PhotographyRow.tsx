import { Link } from "@tanstack/react-router";
import { ResponsiveImage } from "@/lib/images";
import type { Photo } from "@/lib/photos";

type PhotoFilter = "candid" | "traditional" | "intimate" | "pre";

const COLLECTIONS: readonly {
  id: PhotoFilter;
  title: string;
  photo: Photo;
}[] = [
  {
    id: "candid",
    title: "Candid",
    photo: {
      key: "portrait-bride-sunlight",
      alt: "Kerala bride in gold jewellery at a doorway, photographed by Oriana Weddings",
    },
  },
  {
    id: "traditional",
    title: "Traditional",
    photo: {
      key: "ceremony-temple-ritual",
      alt: "Bride in red and gold jewellery, photographed by Oriana Weddings",
    },
  },
  {
    id: "intimate",
    title: "Intimate",
    photo: {
      key: "hero-traditional-intimate",
      alt: "Bride and groom together in wedding attire, photographed by Oriana Weddings",
    },
  },
  {
    id: "pre",
    title: "Pre-wedding",
    photo: {
      key: "haldi-bride-with-friends",
      alt: "Bride and groom in vibrant wedding attire, photographed by Oriana Weddings",
    },
  },
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
            to="/portfolio"
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
