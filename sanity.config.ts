/**
 * Sanity Studio configuration.
 *
 * The Studio is embedded in the site at `/studio` (see `src/routes/studio.tsx`)
 * — one login, same domain, no second deploy. `sanity dev` / `sanity deploy`
 * also read this file if the studio is ever split out.
 *
 * The desk is grouped the way the site reads — Pages, Stories & work, Site
 * settings — so any editor can find a field in seconds. Singletons open
 * directly (no "create new" dead-ends); run `scripts/seed-sanity.mjs` once and
 * every field arrives pre-filled with the current copy, so nothing starts
 * blank.
 *
 * Needs `VITE_SANITY_PROJECT_ID` + `VITE_SANITY_DATASET` (see `.env.example`).
 * Until they are set, the site runs entirely on its built-in content.
 */
import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";

import { schemaTypes } from "./src/sanity/schemas";

const projectId = import.meta.env?.["VITE_SANITY_PROJECT_ID"] ?? "set-me-in-env";
const dataset = import.meta.env?.["VITE_SANITY_DATASET"] ?? "production";

/** One singleton document, opened directly for editing. */
const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem().title(title).child(S.document().schemaType(type).documentId(type).title(title));

export default defineConfig({
  name: "oriana-studio",
  title: "Oriana CMS",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title("Oriana content")
          .items([
            // One section per page, in site order. Pages that own a
            // collection keep it inside their own section — stories live
            // with Photography, films with Films, brands with Brands — so
            // everything about a page is found in exactly one place.
            singleton(S, "homePage", "🏠 Home"),
            S.listItem()
              .title("📷 Photography")
              .child(
                S.list()
                  .title("Photography")
                  .items([
                    singleton(S, "photographyPage", "📷 Photography page"),
                    S.documentTypeListItem("wedding").title("💍 Wedding stories"),
                  ]),
              ),
            S.listItem()
              .title("🎬 Films")
              .child(
                S.list()
                  .title("Films")
                  .items([
                    singleton(S, "filmsPage", "🎬 Films page"),
                    S.documentTypeListItem("film").title("🎬 Wedding films"),
                  ]),
              ),
            singleton(S, "portfolioPage", "🖼️ Portfolio"),
            S.listItem()
              .title("🏷️ Brands")
              .child(
                S.list()
                  .title("Brands")
                  .items([
                    singleton(S, "brandsPage", "🏷️ Brands page"),
                    S.documentTypeListItem("brand").title("🏷️ Brands"),
                  ]),
              ),
            singleton(S, "aboutPage", "📖 About"),
            singleton(S, "contactPage", "✉️ Contact"),
            S.divider(),
            S.listItem()
              .title("⚙️ Site settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("⚙️ Site settings"),
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
