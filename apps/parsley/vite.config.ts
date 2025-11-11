/// <reference types="vitest" />
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, mergeConfig } from "vite";
import { checker } from "vite-plugin-checker";
import envCompatible from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig as defineTestConfig } from "vitest/config";
import dns from "dns";
import path from "path";
import analyticsVisualizer from "@evg-ui/analytics-visualizer";
import {
  generateBaseHTTPSViteServerConfig,
  bareBonesViteConfig,
} from "@evg-ui/vite-utils";
import injectVariablesInHTML from "./config/injectVariablesInHTML";

const getProjectConfig = () => {
  // Remove when https://github.com/cypress-io/cypress/issues/25397 is resolved.
  dns.setDefaultResultOrder("ipv4first");

  const serverConfig = generateBaseHTTPSViteServerConfig({
    port: 5173,
    appURL: process.env.REACT_APP_PARSLEY_URL,
    httpsPort: 8444,
    useHTTPS:
      process.env.REACT_APP_RELEASE_STAGE !== "local" &&
      process.env.NO_HTTPS !== "true",
  });

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
      // Analytics visualization
      analyticsVisualizer({
        analyticsDir: "src/analytics",
        appName: "Parsley",
        honeycombDataset: "parsley",
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

    resolve: {
      alias: {
        // Prevent LG from pulling in SSR dependencies.
        // Can be potentially removed upon the completion of LG-4402.
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
  return mergeConfig(viteConfig, vitestConfig);
};

/** `useProjectConfig` determines if we are running vite as part of a script using vite-node. If so we should return a bare bones config. */
const useProjectConfig = process.env.VITE_SCRIPT_MODE !== "1";
export default useProjectConfig ? getProjectConfig() : bareBonesViteConfig;
