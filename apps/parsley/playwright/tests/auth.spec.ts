import { expect, test } from "@playwright/test";

test.describe("auth (unauthenticated)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/upload");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("redirects user to upload page after logging in", async ({ page }) => {
    await page.goto("/upload");
    await page.getByTestId("login-username").fill("admin");
    await page.getByTestId("login-password").fill("password");
    await page.getByTestId("login-submit").click();
    await expect(page).toHaveURL(/\/upload$/);
  });
});

test.describe("auth (authenticated)", () => {
  test("automatically authenticates user if they are logged in", async ({
    page,
  }) => {
    await page.goto("/upload");
    await expect(page).toHaveURL(/\/upload$/);
  });

  test("redirects user to upload page if they are already logged in and visit login page", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/upload$/);
  });
});
