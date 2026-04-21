import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

const logLink =
  "/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab";

test.describe("Highlighting", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(logLink);
  });

  test("applying a highlight should highlight matching words", async ({
    authenticatedPage: page,
  }) => {
    await helpers.addHighlight(page, "ShardedClusterFixture:job0:mongos0 ");
    const highlights = page.getByTestId("highlight");
    await expect(highlights).toHaveCount(1);
    await expect(highlights.first()).toContainText(
      "ShardedClusterFixture:job0:mongos0 ",
    );
  });

  test("applying a search to a highlighted line should not overwrite an already highlighted term if the search matches the highlight", async ({
    authenticatedPage: page,
  }) => {
    await helpers.addHighlight(page, "ShardedClusterFixture:job0:mongos0 ");
    await helpers.addSearch(page, "ShardedClusterFixture:job0:mongos0 ");
    const highlights = page.getByTestId("highlight");
    await expect(highlights).toHaveCount(1);
    await expect(highlights.first()).toContainText(
      "ShardedClusterFixture:job0:mongos0 ",
    );
  });

  test("should highlight other terms in the log if the search term does not match the highlight", async ({
    authenticatedPage: page,
  }) => {
    await helpers.addHighlight(page, "ShardedClusterFixture:job0:mongos0 ");
    await helpers.addSearch(page, "ShardedClusterFixture:job0:shard0:node1");
    const highlights = page.getByTestId("highlight");
    await expect(highlights).toHaveCount(2);

    const highlightElements = await highlights.all();
    for (const element of highlightElements) {
      const text = await element.innerText();
      expect(text).toMatch(
        /ShardedClusterFixture:job0:mongos0|ShardedClusterFixture:job0:shard0:node1/,
      );
    }
  });

  test("removing a highlight from the side panel should remove the highlight", async ({
    authenticatedPage: page,
  }) => {
    await helpers.addHighlight(page, "ShardedClusterFixture:job0:shard0:node1");
    const highlights = page.getByTestId("highlight");
    expect(await highlights.count()).toBeGreaterThan(0);

    await helpers.toggleDrawer(page);
    await expect(page.getByTestId("delete-highlight-button")).toBeVisible();
    await page.getByTestId("delete-highlight-button").click();
    await expect(highlights).toHaveCount(0);
  });

  test("applying multiple highlights should use different colors", async ({
    authenticatedPage: page,
  }) => {
    await helpers.addHighlight(page, "ShardedClusterFixture:job0:mongos0 ");
    await helpers.addHighlight(page, "ShardedClusterFixture:job0:shard0:node1");
    const highlights = page.getByTestId("highlight");
    await expect(highlights).toHaveCount(2);

    const highlightElements = await highlights.all();
    for (const element of highlightElements) {
      const text = await element.innerText();
      expect(text).toMatch(
        /ShardedClusterFixture:job0:mongos0|ShardedClusterFixture:job0:shard0:node1/,
      );
    }

    const colors = new Set<string>();
    for (const element of highlightElements) {
      const backgroundColor = await element.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue("background-color"),
      );
      colors.add(backgroundColor);
    }
    expect(colors.size).toBe(2);
  });

  test("should automatically add a highlight when a filter term is added if `Apply Highlights to Filters` is enabled", async ({
    authenticatedPage: page,
  }) => {
    await helpers.clickToggle(
      page,
      "highlight-filters-toggle",
      true,
      "search-and-filter",
    );
    await helpers.addFilter(page, "job0");
    const highlights = page.getByTestId("highlight");
    expect(await highlights.count()).toBeGreaterThan(0);

    await helpers.toggleDrawer(page);
    const sideNavHighlights = page.getByTestId("side-nav-highlight");
    await expect(sideNavHighlights).toHaveCount(1);
    await expect(sideNavHighlights.first()).toContainText("job0");
  });

  test("should not add a highlight when a filter term is added if `Apply Highlights to Filters` is disabled", async ({
    authenticatedPage: page,
  }) => {
    await helpers.addFilter(page, "job0");
    const highlights = page.getByTestId("highlight");
    await expect(highlights).toHaveCount(0);

    await helpers.toggleDrawer(page);
    const sideNavHighlights = page.getByTestId("side-nav-highlight");
    await expect(sideNavHighlights).toHaveCount(0);
  });
});
