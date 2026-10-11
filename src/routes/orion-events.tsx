import { createFileRoute } from "@tanstack/react-router";

import { BrandProfile, brandHead, brandLoader } from "@/components/site/BrandProfile";

const SLUG = "orion-events";

export const Route = createFileRoute("/orion-events")({
  loader: () => brandLoader(SLUG),
  head: ({ loaderData }) => brandHead(SLUG, loaderData!.brand),
  component: BrandProfileRoute,
});

function BrandProfileRoute() {
  const { brand } = Route.useLoaderData();
  return <BrandProfile brand={brand} />;
}
