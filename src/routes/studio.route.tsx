import { createFileRoute, Outlet } from "@tanstack/react-router";

import { StudioPage } from "@/sanity/StudioPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/studio")({
  // The Studio is a browser-only editing tool: no SSR, so its bundle never
  // enters the server transform pipeline, and code-splitting keeps it out of
  // every other page's download.
  ssr: false,
  head: () =>
    seo({
      title: "Content Studio | Oriana Weddings",
      description: "Edit the Oriana Weddings site content.",
      path: "/studio",
      // The studio is a tool, not a page — never indexed.
      index: false,
    }),
  // The Studio owns every path under /studio/* (its desk links there). It
  // renders here, once; the index/splat children below swap an empty outlet
  // underneath so desk navigation never remounts it.
  component: () => (
    <>
      <StudioPage />
      <Outlet />
    </>
  ),
});
