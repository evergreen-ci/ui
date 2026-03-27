import { defineConfig } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./playwright/tests",
  forbidOnly: !!process.env.CI, // Fail if implementer accidentally left test.only in any file.
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Disable parallelism - run tests serially like Cypress.
  use: {
    baseURL: "http://localhost:5173",
    viewport: { width: 1280, height: 800 },
    video: process.env.CI ? "on-first-retry" : "off",
    screenshot: process.env.CI ? "only-on-failure" : "off",
    trace: process.env.CI ? "on-first-retry" : "off",
    permissions: ["clipboard-read", "clipboard-write"],
  },
  outputDir: "bin/playwright/test-results",
  reporter: [
    ["list"],
    [
      "junit",
      {
        outputFile: "bin/playwright/junit.xml",
        suiteName: "Parsley E2E Tests",
      },
    ],
    [
      "html",
      {
        title: "Parsley E2E HTML Report",
        outputFolder: "bin/playwright/html",
        open: "never",
      },
    ],
  ],
  globalSetup: "./playwright/global-setup.ts",
  globalTeardown: "./playwright/global-teardown.ts",
});
