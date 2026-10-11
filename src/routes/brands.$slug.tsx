import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Brand pages moved to top-level addresses (`/deor-fashion`) — shorter links,
 * easier to share. The old nested addresses stay working as permanent
 * redirects instead of 404s.
 */
const TOP_LEVEL: Record<string, "/baby-crew-studios" | "/deor-fashion" | "/orion-events" | "/odonata-republic"> = {
  "baby-crew-studios": "/baby-crew-studios",
  "deor-fashion": "/deor-fashion",
  "orion-events": "/orion-events",
  "odonata-republic": "/odonata-republic",
};

export const Route = createFileRoute("/brands/$slug")({
  loader: async ({ params }) => {
    if (params.slug === "oriana-weddings") throw redirect({ to: "/", statusCode: 301 });
    throw redirect({ to: TOP_LEVEL[params.slug] ?? "/brands", statusCode: 301 });
  },
  component: () => null,
});
