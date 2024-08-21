// vite.config.ts
import { sentryVitePlugin } from "file:///Users/arjun.patel/mongo/ui/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import react from "file:///Users/arjun.patel/mongo/ui/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { visualizer } from "file:///Users/arjun.patel/mongo/ui/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { defineConfig } from "file:///Users/arjun.patel/mongo/ui/node_modules/vite/dist/node/index.js";
import checker from "file:///Users/arjun.patel/mongo/ui/node_modules/vite-plugin-checker/dist/esm/main.js";
import envCompatible from "file:///Users/arjun.patel/mongo/ui/node_modules/vite-plugin-env-compatible/dist/index.mjs";
import tsconfigPaths from "file:///Users/arjun.patel/mongo/ui/node_modules/vite-tsconfig-paths/dist/index.mjs";
import dns from "dns";
import path from "path";

// config/injectVariablesInHTML.ts
import pkg from "file:///Users/arjun.patel/mongo/ui/node_modules/replace-in-file/index.js";
var { sync } = pkg;
var injectVariablesInHTML_default = (options) => {
  const from = options.variables.map((v) => new RegExp(v, "g"));
  const to = options.variables.map((v) => process.env[v.replace(/%/g, "")]);
  return {
    name: "injectVariablesInHTML",
    writeBundle: async () => {
      try {
        sync({
          files: options.files,
          from,
          to
        });
      } catch (error) {
        console.error("Error occurred: ", error);
      }
    }
  };
};

// vite.config.ts
var __vite_injected_original_dirname = "/Users/arjun.patel/mongo/ui/apps/parsley";
dns.setDefaultResultOrder("ipv4first");
var vite_config_default = defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        injectVariablesInHTML_default({
          files: "dist/index.html",
          variables: [
            "%APP_VERSION%",
            "%GIT_SHA%",
            "%REACT_APP_RELEASE_STAGE%",
            "%NEW_RELIC_ACCOUNT_ID%",
            "%NEW_RELIC_TRUST_KEY%",
            "%NEW_RELIC_LICENSE_KEY%",
            "%NODE_ENV%",
            "%PARSLEY_NEW_RELIC_AGENT_ID%",
            "%PARSLEY_NEW_RELIC_APPLICATION_ID%"
          ]
        })
      ]
    },
    sourcemap: true
  },
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        // @emotion/babel-plugin injects styled component names (e.g. "StyledSelect") into HTML for dev
        // environments only. It can be toggled for production environments by modifying the parameter
        // autoLabel. (https://emotion.sh/docs/@emotion/babel-plugin)
        plugins: ["@emotion/babel-plugin", "import-graphql"]
      },
      // Exclude storybook stories from fast refresh.
      exclude: /\.stories\.tsx?$/,
      // Only Typescript files should use fast refresh.
      include: ["**/*.tsx", "**/*.ts"],
      // Enables use of css prop on JSX.
      jsxImportSource: "@emotion/react"
    }),
    envCompatible({
      prefix: "REACT_APP_"
    }),
    // Typescript checking
    checker({ typescript: true }),
    // Bundle analyzer
    visualizer({
      filename: "dist/source_map.html",
      template: "treemap"
    }),
    sentryVitePlugin({
      authToken: process.env.PARSLEY_SENTRY_AUTH_TOKEN,
      disable: process.env.NODE_ENV === "development",
      org: "mongodb-org",
      project: "parsley",
      release: {
        name: process.env.npm_package_version
      },
      sourcemaps: {
        assets: "dist/assets/*"
      }
    })
  ],
  // Setting jsxImportSource to @emotion/react raises a warning in the console. This line silences
  // the warning. (https://github.com/vitejs/vite/issues/8644)
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" }
  },
  // The resolve field for @leafygreen-ui/emotion is to prevent LG from pulling in SSR dependencies.
  // It can be potentially removed upon the completion of https://jira.mongodb.org/browse/PD-1543.
  resolve: {
    alias: {
      "@leafygreen-ui/emotion": path.resolve(
        __vite_injected_original_dirname,
        "./config/leafygreen-ui/emotion.ts"
      )
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"]
  },
  test: {
    environment: "jsdom",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    // https://vitest.dev/guide/common-errors.html#failed-to-terminate-worker
    pool: "forks",
    reporters: ["default", ...process.env.CI === "true" ? ["junit"] : []],
    setupFiles: "./config/vitest/setupTests.ts"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29uZmlnL2luamVjdFZhcmlhYmxlc0luSFRNTC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9hcmp1bi5wYXRlbC9tb25nby91aS9hcHBzL3BhcnNsZXlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hcmp1bi5wYXRlbC9tb25nby91aS9hcHBzL3BhcnNsZXkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FyanVuLnBhdGVsL21vbmdvL3VpL2FwcHMvcGFyc2xleS92aXRlLmNvbmZpZy50c1wiOy8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cbmltcG9ydCB7IHNlbnRyeVZpdGVQbHVnaW4gfSBmcm9tIFwiQHNlbnRyeS92aXRlLXBsdWdpblwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgY2hlY2tlciBmcm9tIFwidml0ZS1wbHVnaW4tY2hlY2tlclwiO1xuaW1wb3J0IGVudkNvbXBhdGlibGUgZnJvbSBcInZpdGUtcGx1Z2luLWVudi1jb21wYXRpYmxlXCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuaW1wb3J0IGRucyBmcm9tIFwiZG5zXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGluamVjdFZhcmlhYmxlc0luSFRNTCBmcm9tIFwiLi9jb25maWcvaW5qZWN0VmFyaWFibGVzSW5IVE1MXCI7XG5cbi8vIFJlbW92ZSB3aGVuIGh0dHBzOi8vZ2l0aHViLmNvbS9jeXByZXNzLWlvL2N5cHJlc3MvaXNzdWVzLzI1Mzk3IGlzIHJlc29sdmVkLlxuZG5zLnNldERlZmF1bHRSZXN1bHRPcmRlcihcImlwdjRmaXJzdFwiKTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICBpbmplY3RWYXJpYWJsZXNJbkhUTUwoe1xuICAgICAgICAgIGZpbGVzOiBcImRpc3QvaW5kZXguaHRtbFwiLFxuICAgICAgICAgIHZhcmlhYmxlczogW1xuICAgICAgICAgICAgXCIlQVBQX1ZFUlNJT04lXCIsXG4gICAgICAgICAgICBcIiVHSVRfU0hBJVwiLFxuICAgICAgICAgICAgXCIlUkVBQ1RfQVBQX1JFTEVBU0VfU1RBR0UlXCIsXG4gICAgICAgICAgICBcIiVORVdfUkVMSUNfQUNDT1VOVF9JRCVcIixcbiAgICAgICAgICAgIFwiJU5FV19SRUxJQ19UUlVTVF9LRVklXCIsXG4gICAgICAgICAgICBcIiVORVdfUkVMSUNfTElDRU5TRV9LRVklXCIsXG4gICAgICAgICAgICBcIiVOT0RFX0VOViVcIixcbiAgICAgICAgICAgIFwiJVBBUlNMRVlfTkVXX1JFTElDX0FHRU5UX0lEJVwiLFxuICAgICAgICAgICAgXCIlUEFSU0xFWV9ORVdfUkVMSUNfQVBQTElDQVRJT05fSUQlXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICB9LFxuXG4gIHBsdWdpbnM6IFtcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgcmVhY3Qoe1xuICAgICAgYmFiZWw6IHtcbiAgICAgICAgLy8gQGVtb3Rpb24vYmFiZWwtcGx1Z2luIGluamVjdHMgc3R5bGVkIGNvbXBvbmVudCBuYW1lcyAoZS5nLiBcIlN0eWxlZFNlbGVjdFwiKSBpbnRvIEhUTUwgZm9yIGRldlxuICAgICAgICAvLyBlbnZpcm9ubWVudHMgb25seS4gSXQgY2FuIGJlIHRvZ2dsZWQgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIGJ5IG1vZGlmeWluZyB0aGUgcGFyYW1ldGVyXG4gICAgICAgIC8vIGF1dG9MYWJlbC4gKGh0dHBzOi8vZW1vdGlvbi5zaC9kb2NzL0BlbW90aW9uL2JhYmVsLXBsdWdpbilcbiAgICAgICAgcGx1Z2luczogW1wiQGVtb3Rpb24vYmFiZWwtcGx1Z2luXCIsIFwiaW1wb3J0LWdyYXBocWxcIl0sXG4gICAgICB9LFxuICAgICAgLy8gRXhjbHVkZSBzdG9yeWJvb2sgc3RvcmllcyBmcm9tIGZhc3QgcmVmcmVzaC5cbiAgICAgIGV4Y2x1ZGU6IC9cXC5zdG9yaWVzXFwudHN4PyQvLFxuICAgICAgLy8gT25seSBUeXBlc2NyaXB0IGZpbGVzIHNob3VsZCB1c2UgZmFzdCByZWZyZXNoLlxuICAgICAgaW5jbHVkZTogW1wiKiovKi50c3hcIiwgXCIqKi8qLnRzXCJdLFxuXG4gICAgICAvLyBFbmFibGVzIHVzZSBvZiBjc3MgcHJvcCBvbiBKU1guXG4gICAgICBqc3hJbXBvcnRTb3VyY2U6IFwiQGVtb3Rpb24vcmVhY3RcIixcbiAgICB9KSxcbiAgICBlbnZDb21wYXRpYmxlKHtcbiAgICAgIHByZWZpeDogXCJSRUFDVF9BUFBfXCIsXG4gICAgfSksXG4gICAgLy8gVHlwZXNjcmlwdCBjaGVja2luZ1xuICAgIGNoZWNrZXIoeyB0eXBlc2NyaXB0OiB0cnVlIH0pLFxuICAgIC8vIEJ1bmRsZSBhbmFseXplclxuICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgZmlsZW5hbWU6IFwiZGlzdC9zb3VyY2VfbWFwLmh0bWxcIixcbiAgICAgIHRlbXBsYXRlOiBcInRyZWVtYXBcIixcbiAgICB9KSxcbiAgICBzZW50cnlWaXRlUGx1Z2luKHtcbiAgICAgIGF1dGhUb2tlbjogcHJvY2Vzcy5lbnYuUEFSU0xFWV9TRU5UUllfQVVUSF9UT0tFTixcbiAgICAgIGRpc2FibGU6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIsXG4gICAgICBvcmc6IFwibW9uZ29kYi1vcmdcIixcbiAgICAgIHByb2plY3Q6IFwicGFyc2xleVwiLFxuICAgICAgcmVsZWFzZToge1xuICAgICAgICBuYW1lOiBwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uLFxuICAgICAgfSxcbiAgICAgIHNvdXJjZW1hcHM6IHtcbiAgICAgICAgYXNzZXRzOiBcImRpc3QvYXNzZXRzLypcIixcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG5cbiAgLy8gU2V0dGluZyBqc3hJbXBvcnRTb3VyY2UgdG8gQGVtb3Rpb24vcmVhY3QgcmFpc2VzIGEgd2FybmluZyBpbiB0aGUgY29uc29sZS4gVGhpcyBsaW5lIHNpbGVuY2VzXG4gIC8vIHRoZSB3YXJuaW5nLiAoaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL2lzc3Vlcy84NjQ0KVxuICBlc2J1aWxkOiB7XG4gICAgbG9nT3ZlcnJpZGU6IHsgXCJ0aGlzLWlzLXVuZGVmaW5lZC1pbi1lc21cIjogXCJzaWxlbnRcIiB9LFxuICB9LFxuXG4gIC8vIFRoZSByZXNvbHZlIGZpZWxkIGZvciBAbGVhZnlncmVlbi11aS9lbW90aW9uIGlzIHRvIHByZXZlbnQgTEcgZnJvbSBwdWxsaW5nIGluIFNTUiBkZXBlbmRlbmNpZXMuXG4gIC8vIEl0IGNhbiBiZSBwb3RlbnRpYWxseSByZW1vdmVkIHVwb24gdGhlIGNvbXBsZXRpb24gb2YgaHR0cHM6Ly9qaXJhLm1vbmdvZGIub3JnL2Jyb3dzZS9QRC0xNTQzLlxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQGxlYWZ5Z3JlZW4tdWkvZW1vdGlvblwiOiBwYXRoLnJlc29sdmUoXG4gICAgICAgIF9fZGlybmFtZSxcbiAgICAgICAgXCIuL2NvbmZpZy9sZWFmeWdyZWVuLXVpL2Vtb3Rpb24udHNcIixcbiAgICAgICksXG4gICAgfSxcbiAgICBleHRlbnNpb25zOiBbXCIubWpzXCIsIFwiLmpzXCIsIFwiLnRzXCIsIFwiLmpzeFwiLCBcIi50c3hcIiwgXCIuanNvblwiXSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGVudmlyb25tZW50OiBcImpzZG9tXCIsXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBvdXRwdXRGaWxlOiB7IGp1bml0OiBcIi4vYmluL3ZpdGVzdC9qdW5pdC54bWxcIiB9LFxuICAgIC8vIGh0dHBzOi8vdml0ZXN0LmRldi9ndWlkZS9jb21tb24tZXJyb3JzLmh0bWwjZmFpbGVkLXRvLXRlcm1pbmF0ZS13b3JrZXJcbiAgICBwb29sOiBcImZvcmtzXCIsXG4gICAgcmVwb3J0ZXJzOiBbXCJkZWZhdWx0XCIsIC4uLihwcm9jZXNzLmVudi5DSSA9PT0gXCJ0cnVlXCIgPyBbXCJqdW5pdFwiXSA6IFtdKV0sXG4gICAgc2V0dXBGaWxlczogXCIuL2NvbmZpZy92aXRlc3Qvc2V0dXBUZXN0cy50c1wiLFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9hcmp1bi5wYXRlbC9tb25nby91aS9hcHBzL3BhcnNsZXkvY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYXJqdW4ucGF0ZWwvbW9uZ28vdWkvYXBwcy9wYXJzbGV5L2NvbmZpZy9pbmplY3RWYXJpYWJsZXNJbkhUTUwudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FyanVuLnBhdGVsL21vbmdvL3VpL2FwcHMvcGFyc2xleS9jb25maWcvaW5qZWN0VmFyaWFibGVzSW5IVE1MLnRzXCI7aW1wb3J0IHBrZyBmcm9tIFwicmVwbGFjZS1pbi1maWxlXCI7XG5jb25zdCB7IHN5bmMgfSA9IHBrZztcblxudHlwZSBJbmplY3RWYXJpYWJsZXNJbkhUTUxDb25maWcgPSB7XG4gIGZpbGVzOiBzdHJpbmcgfCBzdHJpbmdbXTtcbiAgdmFyaWFibGVzOiBzdHJpbmdbXTtcbn07XG5leHBvcnQgZGVmYXVsdCAob3B0aW9uczogSW5qZWN0VmFyaWFibGVzSW5IVE1MQ29uZmlnKSA9PiB7XG4gIGNvbnN0IGZyb20gPSBvcHRpb25zLnZhcmlhYmxlcy5tYXAoKHYpID0+IG5ldyBSZWdFeHAodiwgXCJnXCIpKTtcbiAgY29uc3QgdG8gPSBvcHRpb25zLnZhcmlhYmxlcy5tYXAoKHYpID0+IHByb2Nlc3MuZW52W3YucmVwbGFjZSgvJS9nLCBcIlwiKV0pO1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFwiaW5qZWN0VmFyaWFibGVzSW5IVE1MXCIsXG4gICAgd3JpdGVCdW5kbGU6IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN5bmMoe1xuICAgICAgICAgIGZpbGVzOiBvcHRpb25zLmZpbGVzLFxuICAgICAgICAgIGZyb20sXG4gICAgICAgICAgdG8sXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIG9jY3VycmVkOiBcIiwgZXJyb3IpO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsd0JBQXdCO0FBQ2pDLE9BQU8sV0FBVztBQUNsQixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGFBQWE7QUFDcEIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTs7O0FDVGtVLE9BQU8sU0FBUztBQUNuVyxJQUFNLEVBQUUsS0FBSyxJQUFJO0FBTWpCLElBQU8sZ0NBQVEsQ0FBQyxZQUF5QztBQUN2RCxRQUFNLE9BQU8sUUFBUSxVQUFVLElBQUksQ0FBQyxNQUFNLElBQUksT0FBTyxHQUFHLEdBQUcs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
