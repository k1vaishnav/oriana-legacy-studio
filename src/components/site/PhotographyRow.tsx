import { Link } from "@tanstack/react-router";
import { PhotoImage } from "@/lib/images";
import type { HomeCollection } from "@/lib/cms";
import type { Photo } from "@/lib/photos";

type PhotoFilter = "candid" | "traditional" | "intimate" | "pre";

const DEFAULT_COLLECTIONS: readonly {
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
      asset: null,
    },
  },
  {
    id: "traditional",
    title: "Traditional",
    photo: {
      key: "ceremony-temple-ritual",
      alt: "Bride in red and gold jewellery, photographed by Oriana Weddings",
      asset: null,
    },
  },
  {
    id: "intimate",
    title: "Intimate",
    photo: {
      key: "hero-traditional-intimate",
      alt: "Bride and groom together in wedding attire, photographed by Oriana Weddings",
      asset: null,
    },
  },
  {
    id: "pre",
    title: "Pre-wedding",
    photo: {
      key: "haldi-bride-with-friends",
      alt: "Bride and groom in vibrant wedding attire, photographed by Oriana Weddings",
      asset: null,
    },
  },
];

/** Four collection cards — CMS chooses the title, photo and filter per card. */
export function PhotographyRow({ items }: { items?: HomeCollection[] }) {
  const collections =
    items && items.length > 0
      ? items.map((item) => ({
          id: item.id as PhotoFilter,
          title: item.title,
          photo: item.photo,
        }))
      : DEFAULT_COLLECTIONS;
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
        {collections.map((item, index) => (
          <Link
            key={item.id}
            to="/portfolio"
            search={{ filter: item.id }}
            className="photography-collection"
            aria-label={`View ${item.title} wedding photography`}
          >
            <PhotoImage
              photo={item.photo}
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
