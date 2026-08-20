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
        // Inlining @via-ds routes its modules through Vite's resolver; without
        // it, each test worker loads the full via glyph set through Node's ESM
        // resolver, which is slow enough to starve the worker pool.
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
