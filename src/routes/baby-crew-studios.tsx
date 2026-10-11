import { createFileRoute } from "@tanstack/react-router";

import { BrandProfile, brandHead, brandLoader } from "@/components/site/BrandProfile";

const SLUG = "baby-crew-studios";

export const Route = createFileRoute("/baby-crew-studios")({
  loader: () => brandLoader(SLUG),
  head: ({ loaderData }) => brandHead(SLUG, loaderData!.brand),
  component: BrandProfileRoute,
});

function BrandProfileRoute() {
  const { brand } = Route.useLoaderData();
  return <BrandProfile brand={brand} />;
}
