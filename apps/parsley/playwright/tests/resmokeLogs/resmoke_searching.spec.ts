import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

const logLink =
  "/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab";

test.describe("Searching", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("searching for a term should highlight matching words", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(
      authenticatedPage,
      "ShardedClusterFixture:job0:mongos0 ",
    );
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toBeVisible();
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/2");

    const highlights = helpers.getByDataCy(authenticatedPage, "highlight");
    await expect(highlights).toHaveCount(1);
    await expect(highlights.first()).toContainText(
      "ShardedClusterFixture:job0:mongos0 ",
    );
  });

  test("searching for a term should snap the matching line to the top of the window", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "REPL_HB");
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toBeVisible();
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/1436");
    await expect(
      authenticatedPage.locator("[data-highlighted='true']"),
    ).toContainText("REPL_HB");
  });

  test("should be able to specify a range of lines to search", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "REPL_HB");
    await helpers.editBounds(authenticatedPage, { upper: "25" });
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/7");
    await helpers.editBounds(authenticatedPage, { lower: "25" });
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/1");
    await helpers.clearBounds(authenticatedPage);
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/1436");
  });

  test("should be able to toggle case sensitivity", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "Mongos0");
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/2");
    await helpers.clickToggle(authenticatedPage, "case-sensitive-toggle", true);
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("No Matches");
    await helpers.clickToggle(
      authenticatedPage,
      "case-sensitive-toggle",
      false,
    );
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/2");
  });

  test("should be able to paginate through search results", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "conn49");
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toBeVisible();
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/8");

    // Click the button 8 times
    for (let i = 1; i <= 7; i++) {
      await helpers.getByDataCy(authenticatedPage, "next-button").click();
      await expect(
        helpers.getByDataCy(authenticatedPage, "search-count"),
      ).toContainText(`${i + 1}/8`);
    }

    await helpers.getByDataCy(authenticatedPage, "next-button").click();
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/8");

    for (let i = 7; i >= 0; i--) {
      await helpers.getByDataCy(authenticatedPage, "previous-button").click();
      await expect(
        helpers.getByDataCy(authenticatedPage, "search-count"),
      ).toContainText(`${i + 1}/8`);
    }
  });

  test("should not reset search index when a bookmark is applied", async ({
    authenticatedPage,
  }) => {
    await helpers.addSearch(authenticatedPage, "conn49");
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toBeVisible();
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/8");

    await helpers.getByDataCy(authenticatedPage, "next-button").click();
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("2/8");

    await helpers.getByDataCy(authenticatedPage, "log-row-112").dblclick();
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,112,12568/);
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("2/8");
  });

  test("should be able to search on filtered content", async ({
    authenticatedPage,
  }) => {
    await helpers.addFilter(authenticatedPage, "conn49");
    await authenticatedPage
      .locator("[data-cy^='skipped-lines-row-']")
      .first()
      .waitFor();

    const skippedLines = authenticatedPage.locator(
      "[data-cy^='skipped-lines-row-']",
    );
    await expect(skippedLines).toHaveCount(7);

    await helpers.addSearch(authenticatedPage, "NETWORK");
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toBeVisible();
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/6");
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

    await helpers.addSearch(authenticatedPage, "conn49");
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toBeVisible();
    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("No Matches");

    await helpers.toggleDrawer(authenticatedPage);
    await helpers
      .getByDataCy(authenticatedPage, `filter-${filter}`)
      .locator('[aria-label="Delete filter"]')
      .click();

    await expect(authenticatedPage).toHaveURL(/^(?!.*filters)/);
    await expect(
      authenticatedPage.locator("[data-cy^='skipped-lines-row-']"),
    ).toHaveCount(0);

    await expect(
      helpers.getByDataCy(authenticatedPage, "search-count"),
    ).toContainText("1/8");
    await expect(
      authenticatedPage.locator("[data-highlighted='true']"),
    ).toContainText("conn49");
  });
});
