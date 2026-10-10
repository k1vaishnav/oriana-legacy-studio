// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import {
  defineConfig as lovableDefineConfig,
  type LovableViteTanstackOptions,
} from "@lovable.dev/vite-tanstack-config";
import { readFile } from "node:fs/promises";
import { mergeConfig, type ConfigEnv, type PluginOption, type UserConfig } from "vite";

const options: LovableViteTanstackOptions = {
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
};

const buildLovableConfig = lovableDefineConfig(options);

/**
 * Vite 8 resolves tsconfig `paths` itself, so the `vite-tsconfig-paths` plugin the
 * wrapper installs is dead weight (and warns on every boot). Strip it out of the
 * plugin list the wrapper produced and hand resolution to the built-in resolver.
 */
function isTsConfigPathsPlugin(plugin: PluginOption): boolean {
  return (
    typeof plugin === "object" &&
    plugin !== null &&
    "name" in plugin &&
    (plugin.name as string).includes("tsconfig-paths")
  );
}

/**
 * `groq-js` (a Sanity dependency) ships `sourceMappingURL` comments whose maps
 * point at `../src/*` files the publisher never included, so every dev serve
 * logs "Sourcemap points to missing source files". The maps are useless anyway
 * (no sources, no sourcesContent), so drop the comment at transform time and
 * Vite stops chasing the broken chain. Scoped to that package only — legitimate
 * sourcemaps elsewhere are untouched.
 */
function stripGroqSourcemaps(): PluginOption {
  return {
    name: "strip-groq-sourcemaps",
    enforce: "pre",
    // NOTE: this must be `load`, not `transform`. Vite extracts the original
    // file's sourcemap at load time (before any transform runs) and warns
    // about its missing sources when composing maps later — stripping the
    // comment in `transform` is too late. Serving the file here without the
    // comment means no map is ever loaded for it.
    async load(id) {
      // Windows hands some pipelines backslashed ids — normalize first or the
      // match below silently never fires. The query (?v=…) is stripped before
      // the extension check, or `.js?v=…` never ends with `.js`.
      const clean = id.replace(/\\/g, "/").split("?")[0]!;
      if (!clean.includes("node_modules/groq-js/dist/") || !clean.endsWith(".js")) {
        return undefined;
      }
      const code = await readFile(clean, "utf-8").catch(() => null);
      if (!code || !code.includes("sourceMappingURL")) return undefined;
      return code.replace(/\/\/# sourceMappingURL=\S+.*/g, "");
    },
  };
}

export default async function config(env: ConfigEnv): Promise<UserConfig> {
  const base = await buildLovableConfig(env);

  const stripped: UserConfig = {
    ...base,
    plugins: [
      ...(base.plugins ?? []).filter((plugin) => !isTsConfigPathsPlugin(plugin)),
      stripGroqSourcemaps(),
    ],
  };

  return mergeConfig(stripped, {
    resolve: {
      // Native replacement for the removed plugin. This is the whole fix for the
      // deprecation warning — Vite 8 resolves tsconfig `paths` itself.
      tsconfigPaths: true,
    },

    optimizeDeps: {
      // The Sanity Studio bundle ships minified export aliases that break Vite's
      // dev pre-bundler and TanStack Start's server-function transform
      // ("Export 'SCHEDULE_FILTERS' is not defined"). Served unbundled, the
      // Studio loads natively — slower first paint on /studio only, and only
      // in dev. Production builds are unaffected (Rollup handles it).
      // `@sanity/client` stays optimized: it is small and runs in loaders.
      exclude: ["sanity"],
    },

    server: {
      watch: {
        // public/img is the pre-generated responsive set that never changes
        // while deving; keeping it out of chokidar removes it from the
        // initial watch scan.
        ignored: [
          "**/public/img/**",
          "**/.workspace/**",
          "**/.agents/**",
          "**/.claude/**",
          "**/.lovable/**",
          "**/.tanstack/tmp/**",
        ],
        // The wrapper defaults this to 1000ms; 1s before every HMR update is felt.
        awaitWriteFinish: { stabilityThreshold: 150, pollInterval: 50 },
      },
    },
  });
}
