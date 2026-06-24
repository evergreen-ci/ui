/// <reference types="vitest" />
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, mergeConfig } from "vite";
import { checker } from "vite-plugin-checker";
import { defineConfig as defineTestConfig } from "vitest/config";
import path from "path";
import analyticsVisualizer from "@evg-ui/analytics-visualizer";
import {
  generateBaseHTTPSViteServerConfig,
  bareBonesViteConfig,
} from "@evg-ui/vite-utils";

process.env.VITE_APP_VERSION = process.env.npm_package_version ?? "0.0.0";

const getProjectConfig = () => {
  const serverConfig = generateBaseHTTPSViteServerConfig({
    port: 3000,
    appURL: process.env.VITE_SPRUCE_URL ?? "",
    httpsPort: 8443,
    useHTTPS:
      process.env.VITE_RELEASE_STAGE !== "local" &&
      process.env.NO_HTTPS !== "true",
  });

  // https://vitejs.dev/config/
  const viteConfig = defineConfig({
    define: {
      "globalThis.EMOTION_RUNTIME_AUTO_LABEL": JSON.stringify(
        process.env.NODE_ENV === "development",
      ),
    },
    server: serverConfig,
    build: {
      sourcemap: true,
    },
    resolve: {
      tsconfigPaths: true,
      alias: {
        // Prevent LG from pulling in SSR dependencies.
        // Can be potentially removed upon the completion of LG-4402.
        "@emotion/server": "@emotion/css",
        ...(process.env.PROFILER === "true" && {
          "react-dom/client": path.resolve(
            __dirname,
            "../../node_modules/react-dom/profiling",
          ),
          "scheduler/tracing": path.resolve(
            __dirname,
            "../../node_modules/scheduler/tracing-profiling",
          ),
        }),
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    plugins: [
      react({
        // exclude storybook stories
        exclude: [/\.stories\.tsx?$/],
      }),
      // Typescript checking
      checker({ typescript: true }),
      // Bundle analyzer
      visualizer({
        filename: "dist/source_map.html",
        template: "treemap",
      }),
      // Analytics visualization
      analyticsVisualizer({
        analyticsDir: [
          "src/analytics",
          "../../packages/lib/src/analytics/hooks",
        ],
        appName: "Spruce",
        honeycombBaseUrl:
          "https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/spruce",
      }),
      sentryVitePlugin({
        org: "mongodb-org",
        project: "spruce",
        disable: process.env.NODE_ENV === "development",
        authToken: process.env.SPRUCE_SENTRY_AUTH_TOKEN,
        release: {
          name: process.env.npm_package_version,
        },
        sourcemaps: {
          assets: "dist/assets/*",
        },
      }),
    ],
  });

  const vitestConfig = defineTestConfig({
    test: {
      environment: "jsdom",
      globals: true,
      globalSetup: "./config/vitest/global-setup.ts",
      outputFile: { junit: "./bin/vitest/junit.xml" },
      reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
      setupFiles: "@evg-ui/lib/config/vitest/setupTests.ts",
      include: ["src/**/*.test.{ts,tsx}"],
    },
  });

  return mergeConfig(viteConfig, vitestConfig);
};

/** `useProjectConfig` determines if we are running vite as part of a script using vite-node. If so we should return a bare bones config. */
const useProjectConfig = process.env.VITE_SCRIPT_MODE !== "1";
export default useProjectConfig ? getProjectConfig() : bareBonesViteConfig;
