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
        // TODO(UXE-1082): drop @via-ds/components once its root entry stops
        // pulling graphqlHighlight and its graphql-language-service imports
        // carry file extensions, which Node's resolver requires.
        inline: ["@via-ds/components"],
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
