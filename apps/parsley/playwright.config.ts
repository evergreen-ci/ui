import { defineConfig, devices } from "@playwright/test";

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
    testIdAttribute: "data-cy", // TODO DEVPROD-31461: Change to a different attribute.
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
    ["./playwright/reporter.ts"],
    [
      "html",
      {
        title: "Parsley E2E HTML Report",
        outputFolder: "bin/playwright/html",
        open: "never",
      },
    ],
  ],
  // https://playwright.dev/docs/test-global-setup-teardown
  projects: [
    {
      name: "setup db",
      testMatch: "./playwright/global-setup.ts",
      teardown: "cleanup db",
    },
    {
      name: "cleanup db",
      testMatch: "./playwright/global-teardown.ts",
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup db"],
    },
  ],
});
