import { test, expect } from "@playwright/test";
import * as helpers from "../../helpers";

const logLink =
  "/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab";

test.describe("Searching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(logLink);
  });

  test("searching for a term should highlight matching words", async ({
    page,
  }) => {
    await helpers.addSearch(page, "ShardedClusterFixture:job0:mongos0 ");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("1/2");

    const highlights = page.getByTestId("highlight");
    await expect(highlights).toHaveCount(1);
    await expect(highlights.first()).toContainText(
      "ShardedClusterFixture:job0:mongos0 ",
    );
  });

  test("searching for a term should snap the matching line to the top of the window", async ({
    page,
  }) => {
    await helpers.addSearch(page, "REPL_HB");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("1/1436");
    await expect(page.locator("[data-highlighted='true']")).toContainText(
      "REPL_HB",
    );
  });

  test("should be able to specify a range of lines to search", async ({
    page,
  }) => {
    await helpers.addSearch(page, "REPL_HB");
    await helpers.editBounds(page, { upper: "25" });
    await expect(page.getByTestId("search-count")).toContainText("1/7");
    await helpers.editBounds(page, { lower: "25" });
    await expect(page.getByTestId("search-count")).toContainText("1/1");
    await helpers.clearBounds(page);
    await expect(page.getByTestId("search-count")).toContainText("1/1436");
  });

  test("should be able to toggle case sensitivity", async ({ page }) => {
    await helpers.addSearch(page, "Mongos0");
    await expect(page.getByTestId("search-count")).toContainText("1/2");
    await helpers.clickToggle(page, "case-sensitive-toggle", true);
    await expect(page.getByTestId("search-count")).toContainText("No Matches");
    await helpers.clickToggle(page, "case-sensitive-toggle", false);
    await expect(page.getByTestId("search-count")).toContainText("1/2");
  });

  test("should be able to paginate through search results", async ({
    page,
  }) => {
    await helpers.addSearch(page, "conn49");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("1/8");

    // Click the button 8 times
    for (let i = 1; i <= 7; i++) {
      await page.getByTestId("next-button").click();
      await expect(page.getByTestId("search-count")).toContainText(
        `${i + 1}/8`,
      );
    }

    await page.getByTestId("next-button").click();
    await expect(page.getByTestId("search-count")).toContainText("1/8");

    for (let i = 7; i >= 0; i--) {
      await page.getByTestId("previous-button").click();
      await expect(page.getByTestId("search-count")).toContainText(
        `${i + 1}/8`,
      );
    }
  });

  test("should not reset search index when a bookmark is applied", async ({
    page,
  }) => {
    await helpers.addSearch(page, "conn49");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("1/8");

    await page.getByTestId("next-button").click();
    await expect(page.getByTestId("search-count")).toContainText("2/8");

    await page.getByTestId("log-row-112").dblclick();
    await expect(page).toHaveURL(/\?bookmarks=0,112,12568/);
    await expect(page.getByTestId("search-count")).toContainText("2/8");
  });

  test("should be able to search on filtered content", async ({ page }) => {
    await helpers.addFilter(page, "conn49");
    await page.locator("[data-cy^='skipped-lines-row-']").first().waitFor();

    const skippedLines = page.locator("[data-cy^='skipped-lines-row-']");
    await expect(skippedLines).toHaveCount(7);

    await helpers.addSearch(page, "NETWORK");
    await expect(page.getByTestId("search-count")).toBeVisible();
    await expect(page.getByTestId("search-count")).toContainText("1/6");
  });

  test("should update search results automatically when filters are removed", async ({
    page,
  }) => {
    const filter = "nonexistent-term";
    await helpers.addFilter(page, filter);
    await page.locator("[data-cy^='skipped-lines-row-']").first().waitFor();

    await helpers.addSearch(page, "conn49");
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

    await expect(page.getByTestId("search-count")).toContainText("1/8");
    await expect(page.locator("[data-highlighted='true']")).toContainText(
      "conn49",
    );
  });
});
