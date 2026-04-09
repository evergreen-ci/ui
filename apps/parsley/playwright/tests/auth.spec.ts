import { test as base, expect } from "@playwright/test";
import { test } from "../fixtures";
import * as helpers from "../helpers";

test.describe("auth", () => {
  base("unauthenticated user is redirected to login page", async ({ page }) => {
    await helpers.logout(page);
    await page.goto("/upload");
    await expect(page).toHaveURL(/\/login$/);
  });

  base("redirects user to upload page after logging in", async ({ page }) => {
    await helpers.logout(page);
    await page.goto("/upload");
    await page.getByTestId("login-username").fill("admin");
    await page.getByTestId("login-password").fill("password");
    await page.getByTestId("login-submit").click();
    await expect(page).toHaveURL(/\/upload$/);
  });

  test("automatically authenticates user if they are logged in", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/upload");
    await expect(authenticatedPage).toHaveURL(/\/upload$/);
  });

  test("redirects user to upload page if they are already logged in and visit login page", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/login");
    await expect(authenticatedPage).toHaveURL(/\/upload$/);
  });
});
