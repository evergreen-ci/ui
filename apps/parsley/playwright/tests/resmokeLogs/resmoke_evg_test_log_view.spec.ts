import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

const logLink =
  "/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab";

test.describe("Basic resmoke log view", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(logLink);
  });

  test("should render resmoke lines", async ({ authenticatedPage: page }) => {
    const resmokeRows = page.getByTestId("resmoke-row");
    await resmokeRows.first().waitFor();
    expect(await resmokeRows.count()).toBeGreaterThan(0);
  });

  test("by default should have wrapping turned off and should be able to scroll horizontally", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("log-row-16")).toBeVisible();
    await helpers.isNotContainedInViewport(page, "[data-cy=log-row-16]");

    await page.getByTestId("paginated-virtual-list").evaluate((el) => {
      el.scrollTo(500, 0);
    });
  });

  test("long lines with wrapping turned on should fit on screen", async ({
    authenticatedPage: page,
  }) => {
    await helpers.clickToggle(page, "wrap-toggle", true, "log-viewing");
    await expect(page.getByTestId("log-row-16")).toBeVisible();
    await helpers.isContainedInViewport(page, "[data-cy=log-row-16]");
  });

  test("should still allow horizontal scrolling when there are few logs on screen", async ({
    authenticatedPage: page,
  }) => {
    await helpers.addFilter(page, "Putting spruce/");
    await page.getByText("Below").click();
    await page.getByTestId("paginated-virtual-list").evaluate((el) => {
      el.scrollTo(el.scrollWidth, 0);
    });
  });

  test("log header should show breadcrumbs, including one for the test name", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("project-breadcrumb")).toContainText(
      "mongodb-mongo-master",
    );

    await expect(page.getByTestId("version-breadcrumb")).toContainText(
      "Patch 973",
    );
    await page.getByTestId("version-breadcrumb").hover();
    await expect(page.getByTestId("breadcrumb-tooltip")).toContainText(
      "SERVER-45720 Create tests for Atlas Workflows",
    );
    await page.mouse.move(0, 0);

    await expect(page.getByTestId("task-breadcrumb")).toContainText(
      "merge-patch",
    );
    await expect(page.getByTestId("task-breadcrumb")).toHaveAttribute(
      "href",
      "http://localhost:9090/task/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0?redirect_spruce_users=true",
    );
    await expect(page.getByTestId("task-status-badge")).toContainText(
      "Succeeded",
    );

    await expect(page.getByTestId("test-breadcrumb")).toContainText(
      "internal_transactions_kill_sessions.js",
    );
    await expect(page.getByTestId("test-status-badge")).toContainText("Pass");
  });
});

test.describe("Resmoke syntax highlighting", () => {
  const colors = {
    black: "rgb(0, 0, 0)",
    blue: "rgb(8, 60, 144)",
    green: "rgb(0, 163, 92)",
  };

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(logLink);
  });

  test("should not color non-resmoke log lines", async ({
    authenticatedPage: page,
  }) => {
    const resmokeRow = page
      .getByTestId("log-row-0")
      .locator("[data-cy=resmoke-row]");
    const color = await resmokeRow.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue("color"),
    );
    expect(color).toBe(colors.black);
  });

  test("should color similar resmoke lines with the same color", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("log-row-20")).toBeVisible();
    await expect(page.getByTestId("log-row-21")).toBeVisible();
    await expect(page.getByTestId("log-row-20")).toContainText("[j0:s0:n1]");
    await expect(page.getByTestId("log-row-21")).toContainText("[j0:s0:n1]");

    const row20Color = await page
      .getByTestId("log-row-20")
      .locator("[data-cy=resmoke-row]")
      .evaluate((el) => window.getComputedStyle(el).getPropertyValue("color"));
    expect(row20Color).toBe(colors.blue);

    const row21Color = await page
      .getByTestId("log-row-21")
      .locator("[data-cy=resmoke-row]")
      .evaluate((el) => window.getComputedStyle(el).getPropertyValue("color"));
    expect(row21Color).toBe(colors.blue);
  });

  test("should color different resmoke lines with different colors if their resmoke state is different", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("log-row-19")).toBeVisible();
    await expect(page.getByTestId("log-row-20")).toBeVisible();
    await expect(page.getByTestId("log-row-19")).toContainText("[j0:s0:n0]");
    await expect(page.getByTestId("log-row-20")).toContainText("[j0:s0:n1]");

    const row19Color = await page
      .getByTestId("log-row-19")
      .locator("[data-cy=resmoke-row]")
      .evaluate((el) => window.getComputedStyle(el).getPropertyValue("color"));
    expect(row19Color).toBe(colors.green);

    const row20Color = await page
      .getByTestId("log-row-20")
      .locator("[data-cy=resmoke-row]")
      .evaluate((el) => window.getComputedStyle(el).getPropertyValue("color"));
    expect(row20Color).toBe(colors.blue);
  });
});

test.describe("Bookmarking and selecting lines", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(logLink);
  });

  test("should default to bookmarking 0 and the last log line on load", async ({
    authenticatedPage: page,
  }) => {
    await expect(page).toHaveURL(/\?bookmarks=0,12568/);
    await expect(page.getByTestId("bookmark-0")).toBeVisible();
    await expect(page.getByTestId("bookmark-12568")).toBeVisible();
  });

  test("should be able to bookmark and unbookmark log lines", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("log-row-4").dblclick();
    await expect(page).toHaveURL(/\?bookmarks=0,4,12568/);
    await expect(page.getByTestId("bookmark-0")).toBeVisible();
    await expect(page.getByTestId("bookmark-4")).toBeVisible();
    await expect(page.getByTestId("bookmark-12568")).toBeVisible();
    await page.getByTestId("log-row-4").dblclick();
    await expect(page).toHaveURL(/\?bookmarks=0,12568/);
    await expect(page.getByTestId("bookmark-4")).toBeHidden();
  });

  test("should be able to copy a share link to the selected line", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("line-index-5").click();
    await expect(page.getByTestId("sharing-menu")).toBeVisible();
    await expect(page.getByText("Copy share link")).toBeVisible();
    await page.getByText("Copy share link").click();
    await helpers.validateToast(
      page,
      "success",
      "Copied link to clipboard",
      true,
    );
    await helpers.assertValueCopiedToClipboard(
      page,
      "http://localhost:5173/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab?bookmarks=0%2C12568&selectedLineRange=L5&shareLine=5",
    );
  });

  test("should be able to copy bookmarks as JIRA format", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("log-row-10").dblclick();
    await page.getByTestId("log-row-11").dblclick();

    const logLine0 =
      "[fsm_workload_test:internal_transactions_kill_sessions] Fixture status:";
    const logLine10 =
      "|ShardedClusterFixture:job0:mongos0        |j0:s0   |20009|73157|";
    const logLine11 =
      "|ShardedClusterFixture:job0:mongos1        |j0:s1   |20010|73217|";
    const logLine1638 = `[ContinuousStepdown:job0] Pausing the stepdown thread.`;

    await page.getByTestId("details-button").click();
    await page.getByTestId("copy-text-button").click();
    await helpers.assertValueCopiedToClipboard(
      page,
      `{noformat}\n${logLine0}\n...\n${logLine10}\n${logLine11}\n...\n${logLine1638}\n{noformat}`,
    );
  });

  test("should be able to clear bookmarks", async ({
    authenticatedPage: page,
  }) => {
    await expect(page).toHaveURL(/\?bookmarks=0,12568/);
    await page.getByTestId("clear-bookmarks").click();
    await expect(page.getByTestId("clear-bookmarks-popconfirm")).toBeVisible();
    await page.getByRole("button", { name: "Yes" }).click();
    await expect(page).toHaveURL(/^(?!.*bookmarks)/);
  });
});

test.describe("Jump to line", () => {
  test("should be able to use the bookmarks bar to jump to a line when there are no collapsed rows", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(logLink);
    await expect(page.getByTestId("log-row-4")).toBeVisible();
    await page.getByTestId("log-row-4").dblclick();
    await expect(page.getByTestId("bookmark-4")).toBeVisible();

    await page.getByTestId("bookmark-12568").click();
    await expect(page.getByTestId("log-row-12568")).toBeVisible();
    await expect(page.getByTestId("log-row-4")).toBeHidden();

    await page.getByTestId("bookmark-4").click();
    await expect(page.getByTestId("log-row-4")).toBeVisible();
  });

  test("should be able to use the bookmarks bar to jump to a line when there are collapsed rows", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${logLink}?filters=100repl_hb`);
    await expect(page.getByTestId("log-row-30")).toBeVisible();
    await page.getByTestId("log-row-30").dblclick();
    await expect(page).toHaveURL(/bookmarks=0,30,12568/);
    await expect(page.getByTestId("bookmark-30")).toBeVisible();
    await page.getByTestId("bookmark-12568").click();
    await expect(page.getByTestId("log-row-12568")).toBeVisible();
    await expect(page.getByTestId("log-row-30")).toBeHidden();

    await page.getByTestId("bookmark-30").click();
    await expect(page.getByTestId("log-row-30")).toBeVisible();
  });

  test("visiting a log with a share line should jump to that line on page load", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${logLink}?shareLine=200`);
    await expect(page.getByTestId("log-row-200")).toBeVisible();
  });
});

test.describe("expanding collapsed rows", () => {
  const logLinkWithFilters =
    "/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab?bookmarks=0,12568&filters=100ShardedClusterFixture%253Ajob0";

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(logLinkWithFilters);
  });

  test("should be able to expand collapsed rows", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("log-row-1")).toBeHidden();
    await expect(page.getByTestId("log-row-2")).toBeHidden();
    await expect(page.getByTestId("log-row-3")).toBeHidden();

    await page
      .getByTestId("skipped-lines-row-1-3")
      .getByRole("button", { name: "All" })
      .click();

    await expect(page.getByTestId("skipped-lines-row-1-3")).toBeHidden();
    await expect(page.getByTestId("log-row-1")).toBeVisible();
    await expect(page.getByTestId("log-row-2")).toBeVisible();
    await expect(page.getByTestId("log-row-3")).toBeVisible();
  });

  test("should be able to see what rows have been expanded in the drawer", async ({
    authenticatedPage: page,
  }) => {
    await page
      .getByTestId("skipped-lines-row-1-3")
      .getByRole("button", { name: "All" })
      .click();
    await helpers.toggleDrawer(page);
    await expect(page.getByTestId("expanded-row-1-to-3")).toBeVisible();
  });

  test("should be possible to re-collapse rows through the drawer", async ({
    authenticatedPage: page,
  }) => {
    await page
      .getByTestId("skipped-lines-row-1-3")
      .getByRole("button", { name: "All" })
      .click();
    await expect(page.getByTestId("skipped-lines-row-1-3")).toBeHidden();

    await helpers.toggleDrawer(page);
    await page
      .getByTestId("expanded-row-1-to-3")
      .locator(`[aria-label="Delete range"]`)
      .click();
    await expect(page.getByTestId("skipped-lines-row-1-3")).toBeVisible();
  });
});

test.describe("pretty print", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(logLink);
    await page.evaluate(() => {
      localStorage.setItem("pretty-print-bookmarks", "true");
    });
    await page.reload();
  });

  test("should pretty print bookmarks if pretty print is enabled", async ({
    authenticatedPage: page,
  }) => {
    const defaultRowHeight = 18;

    await expect(page.getByTestId("log-row-19")).toBeVisible();
    await page.getByTestId("log-row-19").dblclick();
    const box = await page.getByTestId("log-row-19").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThan(defaultRowHeight);
  });
});

test.describe("Sharing lines", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(logLink);
  });

  test("should present a share button with a menu when a line is selected", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("line-index-1").click();
    await expect(page.getByTestId("sharing-menu-button")).toBeVisible();
    await page.getByTestId("sharing-menu-button").click();
    await expect(page.getByTestId("sharing-menu")).toBeVisible();
  });

  test("shift+click selecting a range of lines should automatically open the sharing menu", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("line-index-1").click();
    await page.getByTestId("line-index-10").click({ modifiers: ["Shift"] });
    await expect(page.getByTestId("sharing-menu")).toBeVisible();
  });

  test("should be able to copy the selected lines as JIRA format", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("line-index-1").click();
    await page.getByTestId("line-index-2").click({ modifiers: ["Shift"] });
    await expect(page.getByTestId("sharing-menu")).toBeVisible();
    await expect(page.getByText("Copy selected contents")).toBeVisible();
    await page.getByText("Copy selected contents").click();
    await helpers.validateToast(
      page,
      "success",
      "Copied 2 lines to clipboard",
      true,
    );
    await helpers.assertValueCopiedToClipboard(
      page,
      "{noformat}\n+------------------------------------------+--------+-----+-----+\n|full_name                                 |name    |port |pid  |\n{noformat}",
    );
  });

  test("should be able to copy a link to the selected lines", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("line-index-1").click();
    await page.getByTestId("line-index-2").click({ modifiers: ["Shift"] });
    await expect(page.getByTestId("sharing-menu")).toBeVisible();
    await expect(page.getByText("Copy share link")).toBeVisible();
    await page.getByText("Copy share link").click();
    await helpers.validateToast(
      page,
      "success",
      "Copied link to clipboard",
      true,
    );
    await helpers.assertValueCopiedToClipboard(
      page,
      "http://localhost:5173/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab?bookmarks=0%2C12568&selectedLineRange=L1-L2&shareLine=1",
    );
  });

  test("should be able to limit the search range to the selected lines", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("line-index-1").click();
    await page.getByTestId("line-index-2").click({ modifiers: ["Shift"] });
    await expect(page.getByTestId("sharing-menu")).toBeVisible();
    await expect(page.getByText("Only search on range")).toBeVisible();
    await page.getByText("Only search on range").click();
    await helpers.toggleDetailsPanel(page, true);
    await expect(page.getByTestId("range-lower-bound")).toHaveValue("1");
    await expect(page.getByTestId("range-upper-bound")).toHaveValue("2");
  });
});

test.describe("Exclude timestamps toggle", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(logLink);
  });

  test("should disable the exclude timestamps toggle for resmoke logs", async ({
    authenticatedPage: page,
  }) => {
    await helpers.toggleDetailsPanel(page, true);
    await page.getByTestId("log-viewing-tab").click();
    await expect(page.getByTestId("exclude-timestamps-toggle")).toBeDisabled();
    await helpers.toggleDetailsPanel(page, false);
  });
});
