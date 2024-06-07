import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    outputFile: { junit: "./bin/vitest/junit.xml" },
    pool: "forks", // https://vitest.dev/guide/common-errors.html#failed-to-terminate-worker
    reporters: ["default", ...(process.env.CI === "true" ? ["junit"] : [])],
  },
});
