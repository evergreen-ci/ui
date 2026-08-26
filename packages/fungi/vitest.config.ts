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
        // The @leafygreen-ui/* packages still have extensionless lodash ESM
        // imports upstream, which Node's resolver rejects outright.
        // @via-ds/icons is inlined for performance: without it each Vitest
        // worker loads the full via glyph set through Node's ESM resolver,
        // which is slow enough to starve the worker pool.
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
