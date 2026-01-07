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
    port: 3000,
    appURL: process.env.REACT_APP_SPRUCE_URL,
    httpsPort: 8443,
    useHTTPS:
      process.env.REACT_APP_RELEASE_STAGE !== "local" &&
      process.env.NO_HTTPS !== "true",
  });

  // https://vitejs.dev/config/
  const viteConfig = defineConfig({
    server: serverConfig,
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-router-dom", "react-dom"],
          },
        },
      },
    },
    resolve: {
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
      tsconfigPaths(),
      // Inject env variables
      envCompatible({
        prefix: "REACT_APP_",
      }),
      // Use emotion jsx tag instead of React.JSX
      react({
        babel: {
          // @emotion/babel-plugin injects styled component names (e.g. "StyledSelect") into HTML for dev
          // environments only. It can be toggled for production environments by modifying the parameter
          // autoLabel. (https://emotion.sh/docs/@emotion/babel-plugin)
          plugins: ["@emotion/babel-plugin", "import-graphql"],
        },
        // exclude storybook stories
        exclude: [/\.stories\.tsx?$/],
      }),
      // Replace the variables in our HTML files.
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
      setupFiles: "./config/vitest/setupTests.ts",
    },
  });

  return mergeConfig(viteConfig, vitestConfig);
};

/** `useProjectConfig` determines if we are running vite as part of a script using vite-node. If so we should return a bare bones config. */
const useProjectConfig = process.env.VITE_SCRIPT_MODE !== "1";
export default useProjectConfig ? getProjectConfig() : bareBonesViteConfig;
