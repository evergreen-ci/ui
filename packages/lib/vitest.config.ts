import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite";
import { defineConfig as defineTestConfig } from "vitest/config";

const viteConfig = defineConfig({
  resolve: {
    tsconfigPaths: true,
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  plugins: [react()],
});

const vitestConfig = defineTestConfig({
  test: {
    environment: "jsdom",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: "./config/vitest/setupTests.ts",
    globalSetup: "./config/vitest/global-setup.ts",
  },
});

export default mergeConfig(viteConfig, vitestConfig);
