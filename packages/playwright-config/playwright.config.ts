import { defineConfig, type PlaywrightTestConfig } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type PlaywrightConfigOptions = Partial<PlaywrightTestConfig> & {
  appName: string;
  baseURL: string;
  viewport: { width: number; height: number };
};

export const createPlaywrightConfig = ({
  appName,
  baseURL,
  reporter,
  use,
  viewport,
  ...overrides
}: PlaywrightConfigOptions): PlaywrightTestConfig =>
  defineConfig({
    testDir: "./playwright/tests",
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    outputDir: "bin/playwright/test-results",
    ...overrides,
    use: {
      baseURL,
      viewport,
      video: process.env.CI ? "on-first-retry" : "off",
      screenshot: process.env.CI ? "only-on-failure" : "off",
      trace: process.env.CI ? "on-first-retry" : "off",
      permissions: ["clipboard-read", "clipboard-write"],
      testIdAttribute: "data-cy",
      ...use,
    },
    reporter: reporter ?? [
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
  });
