/**
 * The Sanity Studio application, loaded lazily and client-only.
 *
 * Imported via `React.lazy` from the `/studio` route (which sets `ssr: false`)
 * so the heavy Studio bundle — and Sanity's prebundled dependencies — never
 * enter the SSR transform pipeline or the initial page load. It downloads only
 * when someone actually visits `/studio`.
 */
import { Studio } from "sanity";

import config from "../../sanity.config";

export default function StudioApp() {
  return (
    <div className="sanity-root">
      <Studio config={config} />
    </div>
  );
}
