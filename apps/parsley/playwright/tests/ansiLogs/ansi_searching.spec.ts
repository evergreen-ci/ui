import { test, expect } from "@playwright/test";
import * as helpers from "../../helpers";

const logLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

test.describe("Searching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(logLink);
  });

  test("searching for a term should highlight matching words", async ({
    page,
  }) => {
    await helpers.addSearch(page, "Starting");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("1/1");

    const highlights = page.getByTestId("highlight");
    await expect(highlights).toHaveCount(1);
    await expect(highlights.first()).toContainText("Starting");
  });

  test("searching for a term should snap the matching line to the top of the window", async ({
    page,
  }) => {
    await helpers.addSearch(page, "info");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("1/4");
    await expect(page.locator("[data-highlighted='true']")).toContainText(
      "info",
    );
  });

  test("should be able to specify a range of lines to search", async ({
    page,
  }) => {
    await helpers.addSearch(page, "info");
    await helpers.editBounds(page, { upper: "25" });
    await expect(page.getByTestId("search-count")).toContainText("1/2");
    await helpers.editBounds(page, { lower: "25" });
    await expect(page.getByTestId("search-count")).toContainText("1/1");
    await helpers.clearBounds(page);
    await expect(page.getByTestId("search-count")).toContainText("1/4");
  });

  test("should be able to toggle case sensitivity", async ({ page }) => {
    await helpers.addSearch(page, "starting");
    await expect(page.getByTestId("search-count")).toContainText("1/1");
    await helpers.clickToggle(page, "case-sensitive-toggle", true);
    await expect(page.getByTestId("search-count")).toContainText("No Matches");
    await helpers.clickToggle(page, "case-sensitive-toggle", false);
    await expect(page.getByTestId("search-count")).toContainText("1/1");
  });

  test("should be able to paginate through search results", async ({
    page,
  }) => {
    await helpers.addSearch(page, "info");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("1/4");

    await page.getByTestId("next-button").click();
    await expect(page.getByTestId("search-count")).toContainText("2/4");

    await page.getByTestId("next-button").click();
    await expect(page.getByTestId("search-count")).toContainText("3/4");

    await page.getByTestId("next-button").click();
    await expect(page.getByTestId("search-count")).toContainText("4/4");

    await page.getByTestId("next-button").click();
    await expect(page.getByTestId("search-count")).toContainText("1/4");

    await page.getByTestId("previous-button").click();
    await expect(page.getByTestId("search-count")).toContainText("4/4");

    await page.getByTestId("previous-button").click();
    await expect(page.getByTestId("search-count")).toContainText("3/4");

    await page.getByTestId("previous-button").click();
    await expect(page.getByTestId("search-count")).toContainText("2/4");

    await page.getByTestId("previous-button").click();
    await expect(page.getByTestId("search-count")).toContainText("1/4");
  });

  test("should not reset search index when a bookmark is applied", async ({
    page,
  }) => {
    await helpers.addSearch(page, "info");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("1/4");

    await page.getByTestId("next-button").click();
    await expect(page.getByTestId("search-count")).toContainText("2/4");

    await page.getByTestId("log-row-27").dblclick();
    await expect(page).toHaveURL(/\?bookmarks=0,27,297/);
    await expect(page.getByTestId("search-count")).toContainText("2/4");
  });

  test("should be able to search on filtered content", async ({ page }) => {
    await helpers.addFilter(page, "installation");
    await page.locator("[data-cy^='skipped-lines-row-']").first().waitFor();

    const skippedLines = page.locator("[data-cy^='skipped-lines-row-']");
    await expect(skippedLines).toHaveCount(3);

    await helpers.addSearch(page, "info");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("1/2");
  });

  test("should update search results automatically when filters are removed", async ({
    page,
  }) => {
    const filter = "nonexistent-term";
    await helpers.addFilter(page, filter);
    await page.locator("[data-cy^='skipped-lines-row-']").first().waitFor();

    await helpers.addSearch(page, "info");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("No Matches");

    await helpers.toggleDrawer(page);
    await page
      .getByTestId(`filter-${filter}`)
      .locator('[aria-label="Delete filter"]')
      .click();

    await expect(page).toHaveURL(/^(?!.*filters)/);
    await expect(page.locator("[data-cy^='skipped-lines-row-']")).toHaveCount(
      0,
    );

    await expect(page.getByTestId("search-count")).toContainText("1/4");
    await expect(page.locator("[data-highlighted='true']")).toContainText(
      "info",
    );
  });
});
