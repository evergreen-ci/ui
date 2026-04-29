import { users } from "@evg-ui/playwright-config/constants";
import { test, expect } from "../../../fixtures";
import { login, logout } from "../../../helpers";
import { getRepoSettingsRoute, repo } from "../constants";

test.describe("permissions", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await logout(page);
  });

  test("disables fields when user lacks edit permissions", async ({
    authenticatedPage: page,
  }) => {
    await login(page, users.privileged);
    await page.goto(getRepoSettingsRoute(repo));
    const settingsPage = page.getByTestId("repo-settings-page");
    await expect(
      settingsPage.locator('input[type="radio"]').first(),
    ).toBeDisabled();
  });

  test("enables fields if user has edit permissions", async ({
    authenticatedPage: page,
  }) => {
    await login(page, users.admin);
    await page.goto(getRepoSettingsRoute(repo));
    const settingsPage = page.getByTestId("repo-settings-page");
    await expect(
      settingsPage.locator('input[type="radio"]').first(),
    ).toBeEnabled();
  });
});
