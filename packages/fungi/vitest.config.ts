import { defineConfig as defineTestConfig } from "vitest/config";

const vitestConfig = defineTestConfig({
  test: {
    environment: "jsdom",
    globals: true,
    globalSetup: "./config/vitest/global-setup.ts",
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    server: {
      deps: {
        // UXE-711: inline ESM-only packages so Vitest can resolve them
        // without tripping over extensionless Node ESM imports.
        inline: [
          "@via-ds/icons",
          "@leafygreen-ui/checkbox",
          "@leafygreen-ui/icon",
          "@leafygreen-ui/icon-button",
          "@leafygreen-ui/loading-overlay",
          "@leafygreen-ui/segmented-control",
          "@leafygreen-ui/toggle",
        ],
      },
    },
    setupFiles: "@evg-ui/lib/config/vitest/setupTests.ts",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    tsconfigPaths: true,
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});

export default vitestConfig;
