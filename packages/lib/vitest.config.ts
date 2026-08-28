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
        // Inlining keeps @via-ds/icons on Vite's resolver; without it each
        // worker Node-loads all 188 glyph modules and the pool starves.
        // Remove once UXE-807 (standalone imports) lands.
        inline: ["@via-ds/icons"],
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
