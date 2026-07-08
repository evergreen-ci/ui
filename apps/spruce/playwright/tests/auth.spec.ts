import { users } from "@evg-ui/playwright-config/constants";
import { test, expect } from "../fixtures";

test.describe("Auth", () => {
  test.describe("unauthenticated", () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("Unauthenticated user is redirected to login page after visiting a private route", async ({
      page,
    }) => {
      await page.goto("/version/123123");
      await expect(page).toHaveURL(/\/login/);
    });

    test("Redirects user to My Patches page after logging in", async ({
      page,
    }) => {
      await page.goto("/");
      await page.getByTestId("login-username").fill(users.admin.username);
      await page.getByTestId("login-password").fill(users.admin.password);
      await page.getByTestId("login-submit").click();
      await expect(page).toHaveURL(/\/user\/admin\/patches/);
    });
  });

  test("Can log out via the dropdown", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/user\/admin\/patches/);
    await page.getByTestId("user-dropdown-link").click();
    await expect(page.getByTestId("log-out")).toBeVisible();
    await page.getByTestId("log-out").click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("Automatically authenticates user if they are logged in", async ({
    page,
  }) => {
    await page.goto("/version/123123");
    await expect(page).toHaveURL(/\/version\/123123/);
  });

  test("Redirects user to their patches page if they are already logged in and visit login page", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/user\/admin\/patches/);
  });
});
