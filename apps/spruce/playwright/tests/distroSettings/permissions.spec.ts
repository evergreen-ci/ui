import { users } from "@evg-ui/playwright-config/constants";
import { test, expect } from "../../fixtures";
import { login, logout } from "../../helpers";

const distroRoute = "/distro/rhel71-power8-large/settings/general";

test.describe("distro permissions", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await logout(page);
  });

  test("hides the new distro button when a user cannot create distros", async ({
    authenticatedPage: page,
  }) => {
    await login(page, users.privileged);
    await page.goto(distroRoute);
    await expect(page.getByTestId("new-distro-button")).toHaveCount(0);
    await expect(page.getByTestId("delete-distro-button")).toBeEnabled();
    await expect(page.locator("textarea").first()).toBeEnabled();
  });

  test("disables the delete button when user lacks admin permissions", async ({
    authenticatedPage: page,
  }) => {
    await login(page, users.regular);
    await page.goto(distroRoute);
    await expect(page.getByTestId("delete-distro-button")).toBeDisabled();
  });

  test("disables fields when user lacks edit permissions", async ({
    authenticatedPage: page,
  }) => {
    await login(page, users.regular);
    await page.goto(distroRoute);
    const settingsPage = page.getByTestId("distro-settings-page");
    await expect(
      settingsPage.locator('input[type="checkbox"]').first(),
    ).toHaveAttribute("aria-disabled", "true");
    await expect(settingsPage.locator("textarea").first()).toBeDisabled();
  });

  test("enables fields if user has edit permissions for a particular distro", async ({
    authenticatedPage: page,
  }) => {
    await login(page, users.regular);
    await page.goto("/distro/localhost/settings/general");
    const settingsPage = page.getByTestId("distro-settings-page");
    await expect(
      settingsPage.locator('input[type="checkbox"]').first(),
    ).toBeEnabled();
    await expect(settingsPage.locator("textarea").first()).toBeEnabled();
  });
});
