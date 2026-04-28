import { devices } from "@playwright/test";
import { createPlaywrightConfig } from "@evg-ui/playwright-config";

export default createPlaywrightConfig({
  appName: "Spruce",
  baseURL: "http://localhost:3000",
  viewport: { width: 1920, height: 1080 },
  workers: 1,
  projects: [
    {
      name: "setup db",
      testDir: "./playwright",
      testMatch: /global-setup\.ts/,
      teardown: "cleanup db",
    },
    {
      name: "cleanup db",
      testDir: "./playwright",
      testMatch: /global-teardown\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup db"],
    },
  ],
});
