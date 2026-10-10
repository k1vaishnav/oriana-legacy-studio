import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { getSiteSettings, useSiteSettings } from "@/lib/cms";
import { useIsStudio } from "@/lib/use-is-studio";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SITE_URL, organizationSchema } from "@/lib/site";

function NotFoundComponent() {
  const { notFound } = useSiteSettings();
  return (
    <div className="shell flex min-h-[70svh] flex-col justify-center py-32">
      <p className="eyebrow">{notFound.eyebrow}</p>
      <h1 className="text-h1 mt-6 max-w-[14ch]">{notFound.title}</h1>
      <p className="lede mt-6">{notFound.body}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/portfolio" className="btn btn-ink hover:btn-ink-hover">
          {notFound.primaryLabel}
        </Link>
        <Link to="/" className="btn btn-line hover:btn-line-hover">
          {notFound.secondaryLabel}
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { errorPage } = useSiteSettings();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="shell flex min-h-[70svh] flex-col justify-center py-32">
      <p className="eyebrow">{errorPage.eyebrow}</p>
      <h1 className="text-h1 mt-6 max-w-[16ch]">{errorPage.title}</h1>
      <p className="lede mt-6">{errorPage.body}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="btn btn-ink hover:btn-ink-hover"
        >
          {errorPage.primaryLabel}
        </button>
        <a href="/" className="btn btn-line hover:btn-line-hover">
          {errorPage.secondaryLabel}
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Site-wide editable content (contact details, socials, manifesto, closing
  // CTA). Served from Sanity when configured, otherwise the built-in copy —
  // and memoized per session, so it costs one request at most.
  loader: async () => ({ settings: await getSiteSettings() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Best Wedding Photographer in Calicut | Oriana Weddings" },
      {
        name: "description",
        content:
          "Oriana Weddings is a 12+ year wedding photography and filmmaking brand based in Calicut and Ahmedabad, managing personalised weddings across Kerala, Gujarat, India and international destinations.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "Oriana Weddings" },
      { property: "og:site_name", content: "Oriana Weddings" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      // Warm paper, not white. The canvas is `--color-paper` (#fcfbf8) and the
      // header sits on it, so pure white flashed a colder frame than the page
      // actually paints on mobile browsers.
      { name: "theme-color", content: "#fcfbf8" },
      { name: "geo.region", content: "IN-KL" },
      { name: "geo.placename", content: "Kozhikode, Kerala" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "alternate icon", href: "/favicon.ico", type: "image/x-icon" },
      /*
       * Two families, one subset each. Both are above the fold on every page:
       * Playfair sets the headings and the hero wordmark, Inter sets the body
       * and the navigation, so neither can be discovered late without a visible
       * reflow. Only `latin` is preloaded — `latin-ext` covers accented place
       * names further down the page, and fetching it eagerly would only compete
       * with the LCP image.
       */
      {
        rel: "preload",
        href: "/fonts/playfair-display-normal-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/inter-normal-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      // Film posters are served from YouTube's image CDN — warm the
      // connection early so the first poster paint costs one less handshake.
      { rel: "preconnect", href: "https://i.ytimg.com" },
      { rel: "dns-prefetch", href: "https://i.ytimg.com" },
    ],
    scripts: [
      {
        // Runs before first paint so the reveal animations have a hidden state to
        // animate from. Without it, .reveal stays fully visible — the correct
        // fallback, but it must not cost a layout shift when JS is available.
        children: 'document.documentElement.classList.add("js");',
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationSchema),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "Oriana Weddings",
          publisher: { "@id": `${SITE_URL}/#organization` },
          inLanguage: "en-IN",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const isStudio = useIsStudio();
  return (
    // The no-flash script above adds `class="js"` to <html> before React
    // hydrates, which React would otherwise report as a mismatch on every single
    // page load. This is the documented case for suppressing it.
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      {/* No site background texture under the Studio — it brings its own theme. */}
      <body className={isStudio ? undefined : "grain"}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isStudio = useIsStudio();

  // `/studio` is Sanity alone: no header, footer, chatbot or site furniture.
  // The stage gives the Studio a full-viewport, white, block-level box of its
  // own — it sizes itself to the viewport (not to the site's flex column),
  // so no collapsed region or site background can show through mid-page.
  if (isStudio) {
    return (
      <QueryClientProvider client={queryClient}>
        <main id="main" className="sanity-stage">
          <Outlet />
        </main>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      {/* Room for the mobile call/WhatsApp bar, which is the only fixed furniture. */}
      <main id="main" className="flex min-h-svh flex-col pb-15 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </QueryClientProvider>
  );
}
