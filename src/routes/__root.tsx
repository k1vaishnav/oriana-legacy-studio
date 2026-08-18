import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyContact } from "@/components/site/StickyContact";
import { SITE_URL, organizationSchema } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-lg mt-6">This page has moved on.</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist. Browse our wedding stories or start a
          conversation with the studio.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/portfolio"
            className="border border-foreground px-8 py-4 text-[0.62rem] tracking-[0.26em] uppercase transition-colors hover:bg-foreground hover:text-primary-foreground"
          >
            View portfolio
          </Link>
          <Link
            to="/"
            className="border border-foreground bg-foreground px-8 py-4 text-[0.62rem] tracking-[0.26em] uppercase text-primary-foreground transition-colors hover:bg-transparent hover:text-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="display-md">This page didn't load</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Something went wrong on our end. Try again or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border border-foreground px-8 py-4 text-[0.62rem] tracking-[0.26em] uppercase"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-foreground bg-foreground px-8 py-4 text-[0.62rem] tracking-[0.26em] uppercase text-primary-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Oriana Weddings — Wedding Photography & Films, Kozhikode" },
      {
        name: "description",
        content:
          "Oriana Weddings is a wedding photography and cinematic wedding film studio in Kozhikode (Calicut), Kerala.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "Oriana Weddings" },
      { property: "og:site_name", content: "Oriana Weddings" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#f7f4ee" },
      { name: "geo.region", content: "IN-KL" },
      { name: "geo.placename", content: "Kozhikode, Kerala" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400&display=swap",
      },
    ],
    scripts: [
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
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main id="main" className="pb-14 lg:pb-0">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <StickyContact />
    </QueryClientProvider>
  );
}
