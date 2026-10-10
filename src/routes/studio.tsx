import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";

const StudioApp = lazy(() => import("@/sanity/StudioApp"));

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
  component: StudioPage,
});

/**
 * The Sanity Studio, embedded at `/studio`.
 *
 * Rendered only after mount: the Studio touches browser APIs that don't exist
 * during SSR, and the route chunk loads only when someone actually visits this
 * URL. Until `VITE_SANITY_PROJECT_ID` is set the Studio shows Sanity's own
 * configuration prompt instead of the desk.
 */
function StudioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ minHeight: "100svh" }} />;
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <StudioApp />
    </Suspense>
  );
}
