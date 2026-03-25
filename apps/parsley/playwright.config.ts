import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./playwright/tests",
  forbidOnly: !!process.env.CI, // Fail if implementer accidentally left test.only in any file.
  retries: process.env.CI ? 3 : 0,
  workers: 1, // Disable parallelism - run tests serially like Cypress.
  use: {
    baseURL: "http://localhost:5173",
    viewport: { width: 1280, height: 800 },
    video: "on-first-retry",
    trace: "on-first-retry",
  },
  reporter: [
    ["list"],
    [
      "junit",
      {
        outputFile: "bin/playwright/junit.xml",
        suiteName: "Parsley E2E Tests",
      },
    ],
  ],
  globalSetup: "./playwright/global-setup.ts",
  globalTeardown: "./playwright/global-teardown.ts",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
