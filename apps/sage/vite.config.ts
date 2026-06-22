import { sentryVitePlugin } from "@sentry/vite-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite";
import envCompatible from "vite-plugin-env-compatible";
import { defineConfig as defineTestConfig } from "vitest/config";

const viteConfig = defineConfig({
  server: {
    port: 5493,
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    // Allows using legacy CRA-based process.env even though Vite projects should use import.meta.env.
    envCompatible({
      prefix: "REACT_APP_",
    }),
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
    tsconfigPaths: true,
    alias: {
      "@emotion/server": "@emotion/css", // TODO: Delete when LeafyGreen is no longer used in this repo.
    },
  },
});

const vitestConfig = defineTestConfig({
  test: {
    environment: "jsdom",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: "@evg-ui/lib/config/vitest/setupTests.ts",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
export default mergeConfig(viteConfig, vitestConfig);
