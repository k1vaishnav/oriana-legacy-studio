import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Fetch the next route's chunk and loader data on hover/focus rather than on
    // click. A wedding portfolio is mostly a handful of pages, so paying for a
    // link's data the moment it is pointed at costs almost nothing and removes
    // the wait from the navigation itself.
    defaultPreload: "intent",
    // Data is loader-only and cheap, so never serve it from a stale cache.
    defaultPreloadStaleTime: 0,
  });

  return router;
};
