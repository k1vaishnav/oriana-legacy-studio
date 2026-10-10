import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The group page moved to `/brands`, where every brand also has its own
 * shareable detail page. This route stays so old links, bookmarks and search
 * results land on the new page with a permanent redirect instead of a 404.
 */
export const Route = createFileRoute("/oriana-group")({
  beforeLoad: () => {
    throw redirect({ to: "/brands", statusCode: 301 });
  },
});
