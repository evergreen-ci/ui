import { test, expect } from "../../fixtures";

test.describe("admin settings page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin-settings");
  });

  test("can navigate to the admin settings page", async ({ page }) => {
    await expect(page.getByTestId("admin-settings-page")).toBeVisible();
  });

  test("defaults to the service flags tab", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin-settings\/service-flags/);
    await expect(page.getByTestId("admin-settings-tab-title")).toHaveText(
      "Service Flags",
    );
  });

  test("has a side navigation with the correct items", async ({ page }) => {
    await page.goto("/admin-settings/general");
    await expect(page.locator("[id=announcements]")).toBeVisible();
  });
});
