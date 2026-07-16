import { sentryVitePlugin } from "@sentry/vite-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite";
import { defineConfig as defineTestConfig } from "vitest/config";

const viteConfig = defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      target: "react",
    }),
    react(),
    sentryVitePlugin({
      authToken: process.env.SAGE_SENTRY_AUTH_TOKEN,
      disable: process.env.NODE_ENV === "development",
      org: "mongodb-org",
      project: "sage-ui",
      release: {
        name: process.env.npm_package_version,
      },
      sourcemaps: {
        assets: "dist/assets/*",
      },
    }),
  ],
  resolve: {
    alias: {
      "@emotion/server": "@emotion/css", // TODO: Delete when LeafyGreen is no longer used in this repo.
    },
    tsconfigPaths: true,
  },
  server: {
    port: 5493,
  },
});

const vitestConfig = defineTestConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: "@evg-ui/lib/config/vitest/setupTests.ts",
  },
});
export default mergeConfig(viteConfig, vitestConfig);
