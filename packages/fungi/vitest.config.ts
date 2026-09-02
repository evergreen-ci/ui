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
        // Inlining works around extensionless lodash ESM imports in the LG
        // packages (rejected by Node's resolver) and keeps @via-ds/icons on
        // Vite's faster resolver (188 glyph modules starve the worker pool).
        inline: [
          "@via-ds/icons",
          "@leafygreen-ui/icon",
          "@leafygreen-ui/icon-button",
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
