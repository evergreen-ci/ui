import { defineConfig, mergeConfig } from "vite";
import { defineConfig as defineTestConfig } from "vitest/config";

const viteConfig = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
});

const vitestConfig = defineTestConfig({
  test: {
    environment: "node",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
  },
});

export default mergeConfig(viteConfig, vitestConfig);
