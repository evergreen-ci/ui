import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite";
import { defineConfig as defineTestConfig } from "vitest/config";

const viteConfig = defineConfig({
  server: {
    port: 5493,
  },
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
});

const vitestConfig = defineTestConfig({
  test: {
    environment: "jsdom",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: ["@evg-ui/lib/config/vitest/setupTests.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});

export default mergeConfig(viteConfig, vitestConfig);
