import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

const logLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

test.describe("Searching", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("searching for a term should highlight matching words", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "Starting");
    await expect(authenticatedPage.getByTestId("search-count")).toBeVisible();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/1",
    );

    const highlights = authenticatedPage.getByTestId("highlight");
    await expect(highlights).toHaveCount(1);
    await expect(highlights.first()).toContainText("Starting");
  });

  test("searching for a term should snap the matching line to the top of the window", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "info");
    await expect(authenticatedPage.getByTestId("search-count")).toBeVisible();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/4",
    );
    await expect(
      authenticatedPage.locator("[data-highlighted='true']"),
    ).toContainText("info");
  });

  test("should be able to specify a range of lines to search", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "info");
    await helpers.editBounds(authenticatedPage, { upper: "25" });
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/2",
    );
    await helpers.editBounds(authenticatedPage, { lower: "25" });
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/1",
    );
    await helpers.clearBounds(authenticatedPage);
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/4",
    );
  });

  test("should be able to toggle case sensitivity", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "starting");
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/1",
    );
    await helpers.clickToggle(authenticatedPage, "case-sensitive-toggle", true);
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "No Matches",
    );
    await helpers.clickToggle(
      authenticatedPage,
      "case-sensitive-toggle",
      false,
    );
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/1",
    );
  });

  test("should be able to paginate through search results", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "info");
    await expect(authenticatedPage.getByTestId("search-count")).toBeVisible();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/4",
    );

    await authenticatedPage.getByTestId("next-button").click();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "2/4",
    );

    await authenticatedPage.getByTestId("next-button").click();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "3/4",
    );

    await authenticatedPage.getByTestId("next-button").click();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "4/4",
    );

    await authenticatedPage.getByTestId("next-button").click();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/4",
    );

    await authenticatedPage.getByTestId("previous-button").click();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "4/4",
    );

    await authenticatedPage.getByTestId("previous-button").click();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "3/4",
    );

    await authenticatedPage.getByTestId("previous-button").click();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "2/4",
    );

    await authenticatedPage.getByTestId("previous-button").click();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/4",
    );
  });

  test("should not reset search index when a bookmark is applied", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "info");
    await expect(authenticatedPage.getByTestId("search-count")).toBeVisible();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/4",
    );

    await authenticatedPage.getByTestId("next-button").click();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "2/4",
    );

    await authenticatedPage.getByTestId("log-row-27").dblclick();
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,27,297/);
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "2/4",
    );
  });

  test("should be able to search on filtered content", async ({
    authenticatedPage,
  }) => {
    await helpers.addFilter(authenticatedPage, "installation");
    await authenticatedPage
      .locator("[data-cy^='skipped-lines-row-']")
      .first()
      .waitFor();

    const skippedLines = authenticatedPage.locator(
      "[data-cy^='skipped-lines-row-']",
    );
    await expect(skippedLines).toHaveCount(3);

    await helpers.addSearch(authenticatedPage, "info");
    await expect(authenticatedPage.getByTestId("search-count")).toBeVisible();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/2",
    );
  });

  test("should update search results automatically when filters are removed", async ({
    authenticatedPage,
  }) => {
    const filter = "nonexistent-term";
    await helpers.addFilter(authenticatedPage, filter);
    await authenticatedPage
      .locator("[data-cy^='skipped-lines-row-']")
      .first()
      .waitFor();

    await helpers.addSearch(authenticatedPage, "info");
    await expect(authenticatedPage.getByTestId("search-count")).toBeVisible();
    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "No Matches",
    );

    await helpers.toggleDrawer(authenticatedPage);
    await authenticatedPage
      .getByTestId(`filter-${filter}`)
      .locator('[aria-label="Delete filter"]')
      .click();

    await expect(authenticatedPage).toHaveURL(/^(?!.*filters)/);
    await expect(
      authenticatedPage.locator("[data-cy^='skipped-lines-row-']"),
    ).toHaveCount(0);

    await expect(authenticatedPage.getByTestId("search-count")).toContainText(
      "1/4",
    );
    await expect(
      authenticatedPage.locator("[data-highlighted='true']"),
    ).toContainText("info");
  });
});
