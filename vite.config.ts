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

export default async function config(env: ConfigEnv): Promise<UserConfig> {
  const base = await buildLovableConfig(env);

  const stripped: UserConfig = {
    ...base,
    plugins: (base.plugins ?? []).filter((plugin) => !isTsConfigPathsPlugin(plugin)),
  };

  return mergeConfig(stripped, {
    resolve: {
      // Native replacement for the removed plugin. This is the whole fix for the
      // deprecation warning — Vite 8 resolves tsconfig `paths` itself.
      tsconfigPaths: true,
    },

    server: {
      watch: {
        // public/img is ~1400 pre-generated files that never change while deving;
        // keeping them out of chokidar removes them from the initial watch scan.
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
