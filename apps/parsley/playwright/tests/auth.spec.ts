import { expect } from "@playwright/test";
import { test } from "../fixtures";
import * as helpers from "../helpers";

test.describe("auth", () => {
  test("unauthenticated user is redirected to login page", async ({
    unauthenticatedPage,
  }) => {
    await helpers.logout(unauthenticatedPage);
    await unauthenticatedPage.goto("/upload");
    await expect(unauthenticatedPage).toHaveURL(/\/login$/);
  });

  test("redirects user to upload page after logging in", async ({
    unauthenticatedPage,
  }) => {
    await helpers.logout(unauthenticatedPage);
    await unauthenticatedPage.goto("/upload");
    await unauthenticatedPage.getByTestId("login-username").fill("admin");
    await unauthenticatedPage.getByTestId("login-password").fill("password");
    await unauthenticatedPage.getByTestId("login-submit").click();
    await expect(unauthenticatedPage).toHaveURL(/\/upload$/);
  });

  test("automatically authenticates user if they are logged in", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/upload");
    await expect(page).toHaveURL(/\/upload$/);
  });

  test("redirects user to upload page if they are already logged in and visit login page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/upload$/);
  });
});
