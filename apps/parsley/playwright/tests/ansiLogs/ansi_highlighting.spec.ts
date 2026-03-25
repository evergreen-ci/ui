import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

const logLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

test.describe("Highlighting", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("applying a highlight should highlight the matching words", async ({
    authenticatedPage,
  }) => {
    await helpers.addHighlight(authenticatedPage, "@bugsnag/plugin-react@");
    const highlights = helpers.getByDataCy(authenticatedPage, "highlight");
    await expect(highlights).toHaveCount(1);
    await expect(highlights.first()).toContainText("@bugsnag/plugin-react@");
  });

  test("applying a search to a highlighted line should not overwrite an already highlighted term if the search matches the highlight", async ({
    authenticatedPage,
  }) => {
    await helpers.addHighlight(authenticatedPage, "@bugsnag/plugin-react@");
    await helpers.addSearch(authenticatedPage, "@bugsnag/plugin-react@");
    const highlights = helpers.getByDataCy(authenticatedPage, "highlight");
    await expect(highlights).toHaveCount(1);
    await expect(highlights.first()).toContainText("@bugsnag/plugin-react");
  });

  test("should highlight other terms in the log if the search term does not match the highlight", async ({
    authenticatedPage,
  }) => {
    await helpers.addHighlight(authenticatedPage, "@bugsnag/plugin-react@");
    await helpers.addSearch(authenticatedPage, "info");
    const highlights = helpers.getByDataCy(authenticatedPage, "highlight");
    await expect(highlights).toHaveCount(5);
    const highlightElements = await highlights.all();
    for (const element of highlightElements) {
      const text = await element.innerText();
      expect(text).toMatch(/@bugsnag\/plugin-react@|info/);
    }
  });

  test("removing a highlight from the side panel should remove the highlight", async ({
    authenticatedPage,
  }) => {
    await helpers.addHighlight(authenticatedPage, "@bugsnag/plugin-react@");
    const highlights = helpers.getByDataCy(authenticatedPage, "highlight");
    expect(await highlights.count()).toBeGreaterThan(0);

    await helpers.toggleDrawer(authenticatedPage);
    await expect(
      helpers.getByDataCy(authenticatedPage, "delete-highlight-button"),
    ).toBeVisible();
    await helpers
      .getByDataCy(authenticatedPage, "delete-highlight-button")
      .click();
    await expect(highlights).toHaveCount(0);
  });

  test("applying multiple highlights should use different colors", async ({
    authenticatedPage,
  }) => {
    await helpers.addHighlight(authenticatedPage, "@bugsnag/plugin-react@");
    await helpers.addHighlight(authenticatedPage, "info");
    const highlights = helpers.getByDataCy(authenticatedPage, "highlight");
    await expect(highlights).toHaveCount(5);

    const highlightElements = await highlights.all();
    for (const element of highlightElements) {
      const text = await element.innerText();
      expect(text).toMatch(/@bugsnag\/plugin-react@|info/);
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

  test("highlights should not corrupt links", async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`${logLink}?shareLine=200`);
    await helpers.addHighlight(authenticatedPage, "github");
    await helpers.addHighlight(authenticatedPage, "storybook");

    const link = helpers
      .getByDataCy(authenticatedPage, "log-row-219")
      .locator("a");
    await expect(link).toHaveAttribute(
      "href",
      "https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-storyfn",
    );
  });

  test("should automatically add a highlight when a filter term is added if `Apply Highlights to Filters` is enabled", async ({
    authenticatedPage,
  }) => {
    await helpers.clickToggle(
      authenticatedPage,
      "highlight-filters-toggle",
      true,
      "search-and-filter",
    );
    await helpers.addFilter(authenticatedPage, "task");
    const highlights = helpers.getByDataCy(authenticatedPage, "highlight");
    expect(await highlights.count()).toBeGreaterThan(0);

    await helpers.toggleDrawer(authenticatedPage);
    const sideNavHighlights = helpers.getByDataCy(
      authenticatedPage,
      "side-nav-highlight",
    );
    await expect(sideNavHighlights).toHaveCount(1);
    await expect(sideNavHighlights.first()).toContainText("task");
  });

  test("should not add a highlight when a filter term is added if `Apply Highlights to Filters` is disabled", async ({
    authenticatedPage,
  }) => {
    await helpers.addFilter(authenticatedPage, "task");
    const highlights = helpers.getByDataCy(authenticatedPage, "highlight");
    await expect(highlights).toHaveCount(0);

    await helpers.toggleDrawer(authenticatedPage);
    const sideNavHighlights = helpers.getByDataCy(
      authenticatedPage,
      "side-nav-highlight",
    );
    await expect(sideNavHighlights).toHaveCount(0);
  });
});
