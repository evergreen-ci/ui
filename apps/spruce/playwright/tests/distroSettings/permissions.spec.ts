import { test, expect } from "../../fixtures";

const distroRoute = "/distro/rhel71-power8-large/settings/general";

test.describe("distro permissions", () => {
  test.describe("privileged user", () => {
    test.use({ storageState: "playwright/.auth/privileged.json" });

    test("hides the new distro button when a user cannot create distros", async ({
      page,
    }) => {
      await page.goto(distroRoute);
      await expect(page.getByTestId("new-distro-button")).toHaveCount(0);
      await expect(page.getByTestId("delete-distro-button")).toBeEnabled();
      await expect(page.locator("textarea").first()).toBeEnabled();
    });
  });

  test.describe("regular user", () => {
    test.use({ storageState: "playwright/.auth/regular.json" });

    test("disables the delete button when user lacks admin permissions", async ({
      page,
    }) => {
      await page.goto(distroRoute);
      await expect(page.getByTestId("delete-distro-button")).toBeDisabled();
    });

    test("disables fields when user lacks edit permissions", async ({
      page,
    }) => {
      await page.goto(distroRoute);
      const settingsPage = page.getByTestId("distro-settings-page");
      await expect(
        settingsPage.locator('input[type="checkbox"]').first(),
      ).toHaveAttribute("aria-disabled", "true");
      await expect(settingsPage.locator("textarea").first()).toBeDisabled();
    });

    test("enables fields if user has edit permissions for a particular distro", async ({
      page,
    }) => {
      await page.goto("/distro/localhost/settings/general");
      const settingsPage = page.getByTestId("distro-settings-page");
      await expect(
        settingsPage.locator('input[type="checkbox"]').first(),
      ).toBeEnabled();
      await expect(settingsPage.locator("textarea").first()).toBeEnabled();
    });
  });
});
