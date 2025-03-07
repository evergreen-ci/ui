/// <reference types="vitest" />
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, mergeConfig, ServerOptions } from "vite";
import { checker } from "vite-plugin-checker";
import envCompatible from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig as defineTestConfig } from "vitest/config";
import dns from "dns";
import * as fs from "fs";
import path from "path";
import injectVariablesInHTML from "./config/injectVariablesInHTML";

// Remove when https://github.com/cypress-io/cypress/issues/25397 is resolved.
dns.setDefaultResultOrder("ipv4first");

let serverConfig: ServerOptions = {
  host: "localhost",
  port: 3000,
};

if (process.env.REMOTE_ENV === "true") {
  const appURL = process.env.REACT_APP_SPRUCE_URL;
  const hostURL = appURL.replace(/https?:\/\//, "");
  // Validate that parsley-local.corp.mongodb.com resolves to 127.0.0.1
  dns.lookup(hostURL, (err, address) => {
    if (err || address !== "127.0.0.1") {
      console.error(`
    ***************************************************************
    *                                                             *
    *  ERROR: ${hostURL} must resolve to       *
    *  127.0.0.1. Did you update your /etc/hosts file?            *
    *                                                             *
    ***************************************************************
      `);
      process.exit(1);
    }
  });

  // Validate the SSL certificates exist
  if (
    !fs.existsSync(path.resolve(__dirname, "localhost-key.pem")) ||
    !fs.existsSync(path.resolve(__dirname, "localhost-cert.pem"))
  ) {
    console.error(`
    *******************************************************************************************************
    *                                                                                                     *
    *  ERROR: localhost-key.pem is missing. Did you run                                                   *
    *  'mkcert -key-file localhost-key.pem -cert-file localhost-cert.pem parsley-local.corp.mongodb.com'?  *
    *                                                                                                     *
    *******************************************************************************************************
      `);
    process.exit(1);
  }

  serverConfig = {
    host: hostURL,
    port: 8444,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "localhost-cert.pem")),
    },
  };
}

// https://vitejs.dev/config/
const viteConfig = defineConfig({
  server: serverConfig,
  build: {
    rollupOptions: {
      plugins: [],
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
    injectVariablesInHTML({
      files: "dist/index.html",
      variables: [
        "%REACT_APP_VERSION%",
        "%GIT_SHA%",
        "%REACT_APP_RELEASE_STAGE%",
        "%NODE_ENV%",
        "%PROFILE_HEAD%",
      ],
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
});

const vitestConfig = defineTestConfig({
  test: {
    environment: "jsdom",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: "./config/vitest/setupTests.ts",
  },
});

export default mergeConfig(viteConfig, vitestConfig);
