import { devices } from "@playwright/test";
import { createPlaywrightConfig } from "@evg-ui/playwright-config";

export default createPlaywrightConfig({
  appName: "Parsley",
  baseURL: "http://localhost:5173",
  viewport: { width: 1280, height: 800 },
  projects: [
    {
      name: "setup",
      testDir: "./playwright",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "bin/playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});
