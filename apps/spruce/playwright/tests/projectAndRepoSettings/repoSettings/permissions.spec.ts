import { test, expect } from "../../../fixtures";
import { getRepoSettingsRoute, repo } from "../constants";

test.describe("permissions", () => {
  test.describe("privileged user", () => {
    test.use({ storageState: "playwright/.auth/privileged.json" });

    test("disables fields when user lacks edit permissions", async ({
      page,
    }) => {
      await page.goto(getRepoSettingsRoute(repo));
      const settingsPage = page.getByTestId("repo-settings-page");
      await expect(
        settingsPage.locator('input[type="radio"]').first(),
      ).toBeDisabled();
    });
  });

  test("enables fields if user has edit permissions", async ({ page }) => {
    await page.goto(getRepoSettingsRoute(repo));
    const settingsPage = page.getByTestId("repo-settings-page");
    await expect(
      settingsPage.locator('input[type="radio"]').first(),
    ).toBeEnabled();
  });
});
