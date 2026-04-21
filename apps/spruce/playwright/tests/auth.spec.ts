import { users } from "@evg-ui/playwright-config/constants";
import { test, expect } from "../fixtures";

test.describe("Auth", () => {
  test("Unauthenticated user is redirected to login page after visiting a private route", async ({
    unauthenticatedPage,
  }) => {
    // Don't use authenticatedPage fixture - we want to test unauthenticated flow.
    await unauthenticatedPage.goto("/version/123123");
    await expect(unauthenticatedPage).toHaveURL(/\/login/);
  });

  test("Redirects user to My Patches page after logging in", async ({
    unauthenticatedPage,
  }) => {
    await unauthenticatedPage.goto("/");
    await unauthenticatedPage
      .getByTestId("login-username")
      .fill(users.admin.username);
    await unauthenticatedPage
      .getByTestId("login-password")
      .fill(users.admin.password);
    await unauthenticatedPage.getByTestId("login-submit").click();
    await expect(unauthenticatedPage).toHaveURL(/\/user\/admin\/patches/);
  });

  test("Can log out via the dropdown", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/user\/admin\/patches/);
    await page.getByTestId("user-dropdown-link").click();
    await expect(page.getByTestId("log-out")).toBeVisible();
    await page.getByTestId("log-out").click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("Automatically authenticates user if they are logged in", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/version/123123");
    await expect(page).toHaveURL(/\/version\/123123/);
  });

  test("Redirects user to their patches page if they are already logged in and visit login page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/user\/admin\/patches/);
  });
});
