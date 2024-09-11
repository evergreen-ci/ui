/// <reference types="vitest" />
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import envCompatible from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";
import dns from "dns";
import path from "path";
import injectVariablesInHTML from "./config/injectVariablesInHTML";

// Remove when https://github.com/cypress-io/cypress/issues/25397 is resolved.
dns.setDefaultResultOrder("ipv4first");

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        injectVariablesInHTML({
          files: "dist/index.html",
          variables: [
            "%APP_VERSION%",
            "%GIT_SHA%",
            "%REACT_APP_RELEASE_STAGE%",
            "%NODE_ENV%",
          ],
        }),
      ],
    },
    sourcemap: true,
  },

  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        // @emotion/babel-plugin injects styled component names (e.g. "StyledSelect") into HTML for dev
        // environments only. It can be toggled for production environments by modifying the parameter
        // autoLabel. (https://emotion.sh/docs/@emotion/babel-plugin)
        plugins: ["@emotion/babel-plugin", "import-graphql"],
      },
      // Exclude storybook stories from fast refresh.
      exclude: /\.stories\.tsx?$/,
      // Only Typescript files should use fast refresh.
      include: ["**/*.tsx", "**/*.ts"],

      // Enables use of css prop on JSX.
      jsxImportSource: "@emotion/react",
    }),
    envCompatible({
      prefix: "REACT_APP_",
    }),
    // Typescript checking
    checker({ typescript: true }),
    // Bundle analyzer
    visualizer({
      filename: "dist/source_map.html",
      template: "treemap",
    }),
    sentryVitePlugin({
      authToken: process.env.PARSLEY_SENTRY_AUTH_TOKEN,
      disable: process.env.NODE_ENV === "development",
      org: "mongodb-org",
      project: "parsley",
      release: {
        name: process.env.npm_package_version,
      },
      sourcemaps: {
        assets: "dist/assets/*",
      },
    }),
  ],

  // Setting jsxImportSource to @emotion/react raises a warning in the console. This line silences
  // the warning. (https://github.com/vitejs/vite/issues/8644)
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },

  // The resolve field for @leafygreen-ui/emotion is to prevent LG from pulling in SSR dependencies.
  // It can be potentially removed upon the completion of https://jira.mongodb.org/browse/PD-1543.
  resolve: {
    alias: {
      "@leafygreen-ui/emotion": path.resolve(
        __dirname,
        "./config/leafygreen-ui/emotion.ts",
      ),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: "./config/vitest/setupTests.ts",
  },
});
