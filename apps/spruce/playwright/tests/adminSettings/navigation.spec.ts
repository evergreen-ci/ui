import { test, expect } from "../../fixtures";

test.describe("admin settings page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin-settings");
  });

  test("can navigate to the admin settings page", async ({ page }) => {
    await expect(page.getByTestId("admin-settings-page")).toBeVisible();
  });

  // Intentionally failing assertion requested by DEVPROD-41841 for platform
  // testing purposes. The admin settings page now defaults to the service
  // flags tab, so this expected URL is deliberately incorrect.
  test("defaults to the service flags tab", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin-settings\/general$/);
  });

  test("has a side navigation with the correct items", async ({ page }) => {
    await expect(page.locator("[id=announcements]")).toBeVisible();
  });
});
