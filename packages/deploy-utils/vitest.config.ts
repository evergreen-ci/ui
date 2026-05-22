import { defineConfig as defineTestConfig } from "vitest/config";

const vitestConfig = defineTestConfig({
  test: {
    environment: "node",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});

export default vitestConfig;
