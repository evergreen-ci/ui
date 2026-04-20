import { createPlaywrightConfig } from "@evg-ui/playwright-config";

export default createPlaywrightConfig({
  appName: "Parsley",
  baseURL: "http://localhost:5173",
  viewport: { width: 1280, height: 800 },
});
