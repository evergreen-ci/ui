import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface PlaywrightConfigOptions {
  appName: string;
  baseURL: string;
  viewport: { width: number; height: number };
}

export const createPlaywrightConfig = ({
  appName,
  baseURL,
  viewport,
}: PlaywrightConfigOptions): PlaywrightTestConfig =>
  defineConfig({
    testDir: "./playwright/tests",
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    use: {
      baseURL,
      viewport,
      video: process.env.CI ? "on-first-retry" : "off",
      screenshot: process.env.CI ? "only-on-failure" : "off",
      trace: process.env.CI ? "on-first-retry" : "off",
      permissions: ["clipboard-read", "clipboard-write"],
      testIdAttribute: "data-cy",
    },
    outputDir: "bin/playwright/test-results",
    reporter: [
      ["list"],
      [
        "junit",
        {
          outputFile: "bin/playwright/junit.xml",
          suiteName: `${appName} E2E Tests`,
        },
      ],
      [path.join(__dirname, "reporter.ts")],
      [
        "html",
        {
          title: `${appName} E2E HTML Report`,
          outputFolder: "bin/playwright/html",
          open: "never",
        },
      ],
    ],
    projects: [
      {
        name: "setup db",
        testMatch: path.join(__dirname, "global-setup.ts"),
        teardown: "cleanup db",
      },
      {
        name: "cleanup db",
        testMatch: path.join(__dirname, "global-teardown.ts"),
      },
      {
        name: "chromium",
        use: { ...devices["Desktop Chrome"] },
        dependencies: ["setup db"],
      },
    ],
  });
