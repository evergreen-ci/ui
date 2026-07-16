import { devices } from "@playwright/test";
import { createPlaywrightConfig } from "@evg-ui/playwright-config";

export default createPlaywrightConfig({
  appName: "Parsley",
  baseURL: "http://localhost:5173",
  projects: [
    {
      name: "setup",
      testDir: "./playwright",
      testMatch: /.*\.setup\.ts/,
    },
    {
      dependencies: ["setup"],
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "bin/playwright/.auth/user.json",
      },
    },
  ],
  viewport: { height: 800, width: 1280 },
});
