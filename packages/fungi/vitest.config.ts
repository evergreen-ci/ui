import { defineConfig, mergeConfig } from "vite";
import { defineConfig as defineTestConfig } from "vitest/config";

const viteConfig = defineConfig({
  resolve: {
    tsconfigPaths: true,
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});

const vitestConfig = defineTestConfig({
  test: {
    environment: "jsdom",
    globals: true,
    globalSetup: "./config/vitest/global-setup.ts",
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: "./config/vitest/setup-tests.ts",
  },
});

export default mergeConfig(viteConfig, vitestConfig);
