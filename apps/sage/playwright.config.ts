import { devices } from "@playwright/test";
import { createPlaywrightConfig } from "@evg-ui/playwright-config";

export default createPlaywrightConfig({
  appName: "Sage",
  baseURL: "http://localhost:5493",
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  viewport: { height: 1080, width: 1920 },
});
