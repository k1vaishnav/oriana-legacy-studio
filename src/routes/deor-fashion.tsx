import { createFileRoute } from "@tanstack/react-router";

import { BrandProfile, brandHead, brandLoader } from "@/components/site/BrandProfile";

const SLUG = "deor-fashion";

export const Route = createFileRoute("/deor-fashion")({
  loader: () => brandLoader(SLUG),
  head: ({ loaderData }) => brandHead(SLUG, loaderData!.brand),
  component: BrandProfileRoute,
});

function BrandProfileRoute() {
  const { brand } = Route.useLoaderData();
  return <BrandProfile brand={brand} />;
}
