import { test, expect } from "../../fixtures";

test.describe("admin settings page", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings");
  });

  test("can navigate to the admin settings page", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("admin-settings-page")).toBeVisible();
  });

  test("has a side navigation with the correct items", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.locator("[id=announcements]")).toBeVisible();
  });
});
