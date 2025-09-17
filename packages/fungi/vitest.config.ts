import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // workaround until LG-4402 is fixed
      "@emotion/server": "@emotion/css",
      "@leafygreen-ui/emotion": resolve(
        __dirname,
        "./config/leafygreen-ui/emotion",
      ),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    globalSetup: "./config/vitest/global-setup.ts",
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: "./config/vitest/setup-tests.ts",
  },
});
