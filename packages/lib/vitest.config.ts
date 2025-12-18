import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: "./config/vitest/setupTests.ts",
    globalSetup: "./config/vitest/global-setup.ts",
  },
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: ["import-graphql"],
      },
    }),
  ],
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
