import react from "@vitejs/plugin-react";
import { defineConfig as defineTestConfig } from "vitest/config";

const vitestConfig = defineTestConfig({
  test: {
    environment: "jsdom",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: "./config/vitest/setupTests.ts",
    globalSetup: "./config/vitest/global-setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    server: {
      deps: {
        // TODO UXE-711: remove once @via-ds/icons fixes its extensionless
        // "lodash-es/kebabCase" import, which Node's ESM resolver rejects.
        // Inlining routes it through Vite's resolver instead.
        inline: [/@via-ds\//],
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  plugins: [react()],
});

export default vitestConfig;
