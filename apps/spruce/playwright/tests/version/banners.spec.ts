import { test, expect } from "../../fixtures";

const versionWithBanners =
  "/version/logkeeper_e864cf934194c161aa044e4599c8c81cee7b6237/tasks?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC";

test.describe("banners", () => {
  test.describe("errors", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(versionWithBanners);
    });

    test("should display the number of configuration errors", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByTestId("configuration-errors-banner"),
      ).toBeVisible();
      await expect(
        page.getByText("4 errors in configuration file"),
      ).toBeVisible();
    });

    test("should be able to open the modal and see all errors", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("configuration-errors-modal-trigger").click();
      await expect(
        page.getByTestId("configuration-errors-modal"),
      ).toBeVisible();
      await expect(page.locator("li")).toHaveCount(4);
    });
  });

  test.describe("warnings", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(versionWithBanners);
    });

    test("should display the number of configuration warnings", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByTestId("configuration-warnings-banner"),
      ).toBeVisible();
      await expect(
        page.getByText("3 warnings in configuration file"),
      ).toBeVisible();
    });

    test("should be able to open the modal and see all warnings", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("configuration-warnings-modal-trigger").click();
      await expect(
        page.getByTestId("configuration-warnings-modal"),
      ).toBeVisible();
      await expect(page.locator("li")).toHaveCount(3);
    });
  });

  test.describe("ignored", () => {
    test("should display a banner", async ({ authenticatedPage: page }) => {
      await page.goto(
        "/version/spruce_e695f654c8b4b959d3e12e71696c3e318bcd4c33",
      );
      await expect(page.getByTestId("ignored-banner")).toBeVisible();
    });
  });
});
