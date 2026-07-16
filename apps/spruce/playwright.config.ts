import { devices } from "@playwright/test";
import { createPlaywrightConfig } from "@evg-ui/playwright-config";

export default createPlaywrightConfig({
  appName: "Spruce",
  baseURL: "http://localhost:3000",
  projects: [
    {
      name: "setup db",
      teardown: "cleanup db",
      testDir: "./playwright",
      testMatch: /global-setup\.ts/,
    },
    {
      name: "cleanup db",
      testDir: "./playwright",
      testMatch: /global-teardown\.ts/,
    },
    {
      dependencies: ["setup db"],
      name: "setup auth",
      testDir: "./playwright",
      testMatch: /auth\.setup\.ts/,
    },
    {
      dependencies: ["setup db", "setup auth"],
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/admin.json",
      },
    },
  ],
  viewport: { height: 1080, width: 1920 },
  workers: 1,
});
