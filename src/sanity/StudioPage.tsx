import { lazy, Suspense, useEffect, useState } from "react";

const StudioApp = lazy(() => import("./StudioApp"));

/**
 * The Sanity Studio view, mounted once.
 *
 * Rendered by the `/studio` layout route so it stays mounted while the desk
 * navigates its own sub-paths (`/studio/structure`, …) — only the empty child
 * route swaps underneath, never the Studio itself. Client-only: the Studio
 * touches browser APIs that don't exist during SSR, and its bundle downloads
 * only when someone actually visits `/studio`.
 */
export function StudioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="sanity-boot" />;
  return (
    <Suspense fallback={<div className="sanity-boot" />}>
      <StudioApp />
    </Suspense>
  );
}
