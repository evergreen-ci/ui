import { test as setup } from "@playwright/test";
import { login } from "@evg-ui/playwright-config/helpers";

const authFile = "bin/playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await login(page);
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("drawer-opened", "true");
    localStorage.setItem("has-seen-searchbar-guide-cue-tab-complete", "true");
  });
  await page.context().storageState({ path: authFile });
});
