import { defineConfig as defineTestConfig } from "vitest/config";

const vitestConfig = defineTestConfig({
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    globalSetup: "./config/vitest/global-setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    setupFiles: "@evg-ui/lib/config/vitest/setupTests.ts",
  },
});

export default vitestConfig;
