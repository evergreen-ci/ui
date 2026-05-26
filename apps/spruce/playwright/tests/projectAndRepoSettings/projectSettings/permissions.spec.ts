import { test, expect } from "../../../fixtures";
import { getProjectSettingsRoute, projectUseRepoEnabled } from "../constants";

test.describe("permissions", () => {
  test.describe("projects", () => {
    test.describe("privileged user", () => {
      test.use({ storageState: "playwright/.auth/privileged.json" });

      test("disables fields when user lacks edit permissions", async ({
        page,
      }) => {
        await page.goto(getProjectSettingsRoute(projectUseRepoEnabled));
        const settingsPage = page.getByTestId("project-settings-page");
        await expect(
          settingsPage.locator('input[type="radio"]').first(),
        ).toBeDisabled();
      });
    });

    test("enables fields if user has edit permissions", async ({ page }) => {
      await page.goto(getProjectSettingsRoute(projectUseRepoEnabled));
      const settingsPage = page.getByTestId("project-settings-page");
      await expect(
        settingsPage.locator('input[type="radio"]').first(),
      ).toBeEnabled();
    });
  });
});
