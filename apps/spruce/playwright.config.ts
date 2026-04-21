import { createPlaywrightConfig } from "@evg-ui/playwright-config";

export default createPlaywrightConfig({
  appName: "Spruce",
  baseURL: "http://localhost:3000",
  viewport: { width: 1920, height: 1080 },
});
