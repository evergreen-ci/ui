import { test, expect } from "../../fixtures";

test.describe("navigation", () => {
  test("can view the waterfall page", async ({ authenticatedPage: page }) => {
    await page.goto("/project/evergreen/waterfall");
    await expect(page.getByTestId("waterfall-page")).toBeVisible();
  });

  test("can visit other projects using project select", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/project/evergreen/waterfall");
    await expect(page.getByTestId("waterfall-page")).toBeVisible();

    await page.getByTestId("project-select").click();
    await page.getByTestId("project-display-name").getByText("Spruce").click();
    await expect(page).toHaveURL("/project/spruce/waterfall");
    await expect(page.getByTestId("waterfall-page")).toBeVisible();
  });

  test("project select stays open when typing a space", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/project/evergreen/waterfall");
    await expect(page.getByTestId("waterfall-page")).toBeVisible();

    await page.getByTestId("project-select").click();
    const searchInput = page.getByPlaceholder("Search projects");
    await expect(searchInput).toBeVisible();
    await searchInput.fill(" ");
    await expect(searchInput).toBeVisible();
  });

  test("is redirected to the waterfall page when a user visits a legacy route", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/commits/evergreen");
    await expect(page).toHaveURL("/project/evergreen/waterfall");
    await page.goto("/commits/evergreen?taskNames=test");
    await expect(page).toHaveURL("/project/evergreen/waterfall?tasks=test");
    await page.goto("/commits/evergreen?buildVariants=Ubuntu");
    await expect(page).toHaveURL(
      "/project/evergreen/waterfall?buildVariants=Ubuntu",
    );
  });
});
