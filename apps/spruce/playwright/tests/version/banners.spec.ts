import { test, expect } from "../../fixtures";

const versionWithBanners =
  "/version/logkeeper_e864cf934194c161aa044e4599c8c81cee7b6237/tasks?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC";

test.describe("banners", () => {
  test.describe("errors", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(versionWithBanners);
    });

    test("should display the number of configuration errors", async ({
      page,
    }) => {
      const errorBanner = page.getByTestId("configuration-errors-banner");
      await expect(errorBanner).toBeVisible();
      await expect(
        errorBanner.getByText("4 errors in configuration file"),
      ).toBeVisible();
    });

    test("should be able to open the modal and see all errors", async ({
      page,
    }) => {
      await page.getByTestId("configuration-errors-modal-trigger").click();
      const modal = page.getByTestId("configuration-errors-modal");
      await expect(modal).toBeVisible();
      await expect(modal.locator("li")).toHaveCount(4);
    });
  });

  test.describe("warnings", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(versionWithBanners);
    });

    test("should display the number of configuration warnings", async ({
      page,
    }) => {
      const warningBanner = page.getByTestId("configuration-warnings-banner");
      await expect(warningBanner).toBeVisible();
      await expect(
        warningBanner.getByText("3 warnings in configuration file"),
      ).toBeVisible();
    });

    test("should be able to open the modal and see all warnings", async ({
      page,
    }) => {
      await page.getByTestId("configuration-warnings-modal-trigger").click();
      const modal = page.getByTestId("configuration-warnings-modal");
      await expect(modal).toBeVisible();
      await expect(modal.locator("li")).toHaveCount(3);
    });
  });

  test.describe("ignored", () => {
    test("should display a banner", async ({ page }) => {
      await page.goto(
        "/version/spruce_e695f654c8b4b959d3e12e71696c3e318bcd4c33",
      );
      await expect(page.getByTestId("ignored-banner")).toBeVisible();
    });
  });
});
