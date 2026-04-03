import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

const logLink =
  "/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab";

test.describe("Basic resmoke log view", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("should render resmoke lines", async ({ authenticatedPage }) => {
    const resmokeRows = authenticatedPage.getByTestId("resmoke-row");
    await resmokeRows.first().waitFor();
    expect(await resmokeRows.count()).toBeGreaterThan(0);
  });

  test("by default should have wrapping turned off and should be able to scroll horizontally", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage.getByTestId("log-row-16")).toBeVisible();
    await helpers.isNotContainedInViewport(
      authenticatedPage,
      "[data-cy=log-row-16]",
    );

    await authenticatedPage
      .getByTestId("paginated-virtual-list")
      .evaluate((el) => {
        el.scrollTo(500, 0);
      });
  });

  test("long lines with wrapping turned on should fit on screen", async ({
    authenticatedPage,
  }) => {
    await helpers.clickToggle(
      authenticatedPage,
      "wrap-toggle",
      true,
      "log-viewing",
    );
    await expect(authenticatedPage.getByTestId("log-row-16")).toBeVisible();
    await helpers.isContainedInViewport(
      authenticatedPage,
      "[data-cy=log-row-16]",
    );
  });

  test("should still allow horizontal scrolling when there are few logs on screen", async ({
    authenticatedPage,
  }) => {
    await helpers.addFilter(authenticatedPage, "Putting spruce/");
    await authenticatedPage.getByText("Below").click();
    await authenticatedPage
      .getByTestId("paginated-virtual-list")
      .evaluate((el) => {
        el.scrollTo(el.scrollWidth, 0);
      });
  });

  test("log header should show breadcrumbs, including one for the test name", async ({
    authenticatedPage,
  }) => {
    await expect(
      authenticatedPage.getByTestId("project-breadcrumb"),
    ).toContainText("mongodb-mongo-master");

    await expect(
      authenticatedPage.getByTestId("version-breadcrumb"),
    ).toContainText("Patch 973");
    await authenticatedPage.getByTestId("version-breadcrumb").hover();
    await expect(
      authenticatedPage.getByTestId("breadcrumb-tooltip"),
    ).toContainText("SERVER-45720 Create tests for Atlas Workflows");
    await authenticatedPage.mouse.move(0, 0);

    await expect(
      authenticatedPage.getByTestId("task-breadcrumb"),
    ).toContainText("merge-patch");
    await expect(
      authenticatedPage.getByTestId("task-breadcrumb"),
    ).toHaveAttribute(
      "href",
      "http://localhost:9090/task/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0?redirect_spruce_users=true",
    );
    await expect(
      authenticatedPage.getByTestId("task-status-badge"),
    ).toContainText("Succeeded");

    await expect(
      authenticatedPage.getByTestId("test-breadcrumb"),
    ).toContainText("internal_transactions_kill_sessions.js");
    await expect(
      authenticatedPage.getByTestId("test-status-badge"),
    ).toContainText("Pass");
  });
});

test.describe("Resmoke syntax highlighting", () => {
  const colors = {
    black: "rgb(0, 0, 0)",
    blue: "rgb(8, 60, 144)",
    green: "rgb(0, 163, 92)",
  };

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("should not color non-resmoke log lines", async ({
    authenticatedPage,
  }) => {
    const resmokeRow = authenticatedPage
      .getByTestId("log-row-0")
      .locator("[data-cy=resmoke-row]");
    const color = await resmokeRow.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue("color"),
    );
    expect(color).toBe(colors.black);
  });

  test("should color similar resmoke lines with the same color", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage.getByTestId("log-row-20")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-21")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-20")).toContainText(
      "[j0:s0:n1]",
    );
    await expect(authenticatedPage.getByTestId("log-row-21")).toContainText(
      "[j0:s0:n1]",
    );

    const row20Color = await authenticatedPage
      .getByTestId("log-row-20")
      .locator("[data-cy=resmoke-row]")
      .evaluate((el) => window.getComputedStyle(el).getPropertyValue("color"));
    expect(row20Color).toBe(colors.blue);

    const row21Color = await authenticatedPage
      .getByTestId("log-row-21")
      .locator("[data-cy=resmoke-row]")
      .evaluate((el) => window.getComputedStyle(el).getPropertyValue("color"));
    expect(row21Color).toBe(colors.blue);
  });

  test("should color different resmoke lines with different colors if their resmoke state is different", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage.getByTestId("log-row-19")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-20")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-19")).toContainText(
      "[j0:s0:n0]",
    );
    await expect(authenticatedPage.getByTestId("log-row-20")).toContainText(
      "[j0:s0:n1]",
    );

    const row19Color = await authenticatedPage
      .getByTestId("log-row-19")
      .locator("[data-cy=resmoke-row]")
      .evaluate((el) => window.getComputedStyle(el).getPropertyValue("color"));
    expect(row19Color).toBe(colors.green);

    const row20Color = await authenticatedPage
      .getByTestId("log-row-20")
      .locator("[data-cy=resmoke-row]")
      .evaluate((el) => window.getComputedStyle(el).getPropertyValue("color"));
    expect(row20Color).toBe(colors.blue);
  });
});

test.describe("Bookmarking and selecting lines", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("should default to bookmarking 0 and the last log line on load", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,12568/);
    await expect(authenticatedPage.getByTestId("bookmark-0")).toBeVisible();
    await expect(authenticatedPage.getByTestId("bookmark-12568")).toBeVisible();
  });

  test("should be able to bookmark and unbookmark log lines", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("log-row-4").dblclick();
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,4,12568/);
    await expect(authenticatedPage.getByTestId("bookmark-0")).toBeVisible();
    await expect(authenticatedPage.getByTestId("bookmark-4")).toBeVisible();
    await expect(authenticatedPage.getByTestId("bookmark-12568")).toBeVisible();
    await authenticatedPage.getByTestId("log-row-4").dblclick();
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,12568/);
    await expect(authenticatedPage.getByTestId("bookmark-4")).toBeHidden();
  });

  test("should be able to set and unset the share line", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("log-link-5").click();
    await expect(authenticatedPage).toHaveURL(
      /\?bookmarks=0,12568&shareLine=5/,
    );
    await expect(authenticatedPage.getByTestId("bookmark-0")).toBeVisible();
    await expect(authenticatedPage.getByTestId("bookmark-5")).toBeVisible();
    await expect(authenticatedPage.getByTestId("bookmark-12568")).toBeVisible();
    await authenticatedPage.getByTestId("log-link-5").click();
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,12568/);
    await expect(authenticatedPage.getByTestId("bookmark-5")).toBeHidden();
  });

  test("should be able to copy bookmarks as JIRA format", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("log-row-10").dblclick({ force: true });
    await authenticatedPage.getByTestId("log-row-11").dblclick({ force: true });

    const logLine0 =
      "[fsm_workload_test:internal_transactions_kill_sessions] Fixture status:";
    const logLine10 =
      "|ShardedClusterFixture:job0:mongos0        |j0:s0   |20009|73157|";
    const logLine11 =
      "|ShardedClusterFixture:job0:mongos1        |j0:s1   |20010|73217|";
    const logLine1638 = `[ContinuousStepdown:job0] Pausing the stepdown thread.`;

    await authenticatedPage.getByTestId("details-button").click();
    await authenticatedPage.getByTestId("copy-text-button").click();
    await helpers.assertValueCopiedToClipboard(
      authenticatedPage,
      `{noformat}\n${logLine0}\n...\n${logLine10}\n${logLine11}\n...\n${logLine1638}\n{noformat}`,
    );
  });

  test("should be able to clear bookmarks", async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,12568/);
    await authenticatedPage.getByTestId("clear-bookmarks").click();
    await expect(
      authenticatedPage.getByTestId("clear-bookmarks-popconfirm"),
    ).toBeVisible();
    await authenticatedPage.getByRole("button", { name: "Yes" }).click();
    await expect(authenticatedPage).toHaveURL(/^(?!.*bookmarks)/);
  });
});

test.describe("Jump to line", () => {
  test("should be able to use the bookmarks bar to jump to a line when there are no collapsed rows", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(logLink);
    await expect(authenticatedPage.getByTestId("log-row-4")).toBeVisible();
    await authenticatedPage.getByTestId("log-row-4").dblclick({ force: true });
    await expect(authenticatedPage.getByTestId("bookmark-4")).toBeVisible();

    await authenticatedPage.getByTestId("bookmark-12568").click();
    await expect(authenticatedPage.getByTestId("log-row-12568")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-4")).toBeHidden();

    await authenticatedPage.getByTestId("bookmark-4").click();
    await expect(authenticatedPage.getByTestId("log-row-4")).toBeVisible();
  });

  test("should be able to use the bookmarks bar to jump to a line when there are collapsed rows", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(`${logLink}?filters=100repl_hb`);
    await expect(authenticatedPage.getByTestId("log-row-30")).toBeVisible();
    await authenticatedPage.getByTestId("log-row-30").dblclick({ force: true });
    await expect(authenticatedPage).toHaveURL(/bookmarks=0,30,12568/);
    await expect(authenticatedPage.getByTestId("bookmark-30")).toBeVisible();
    await authenticatedPage.getByTestId("bookmark-12568").click();
    await expect(authenticatedPage.getByTestId("log-row-12568")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-30")).toBeHidden();

    await authenticatedPage.getByTestId("bookmark-30").click();
    await expect(authenticatedPage.getByTestId("log-row-30")).toBeVisible();
  });

  test("visiting a log with a share line should jump to that line on page load", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(`${logLink}?shareLine=200`);
    await expect(authenticatedPage.getByTestId("log-row-200")).toBeVisible();
  });
});

test.describe("expanding collapsed rows", () => {
  const logLinkWithFilters =
    "/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab?bookmarks=0,12568&filters=100ShardedClusterFixture%253Ajob0";

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLinkWithFilters);
  });

  test("should be able to expand collapsed rows", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage.getByTestId("log-row-1")).toBeHidden();
    await expect(authenticatedPage.getByTestId("log-row-2")).toBeHidden();
    await expect(authenticatedPage.getByTestId("log-row-3")).toBeHidden();

    await authenticatedPage
      .getByTestId("skipped-lines-row-1-3")
      .getByRole("button", { name: "All" })
      .click();

    await expect(
      authenticatedPage.getByTestId("skipped-lines-row-1-3"),
    ).toBeHidden();
    await expect(authenticatedPage.getByTestId("log-row-1")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-2")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-3")).toBeVisible();
  });

  test("should be able to see what rows have been expanded in the drawer", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage
      .getByTestId("skipped-lines-row-1-3")
      .getByRole("button", { name: "All" })
      .click();
    await helpers.toggleDrawer(authenticatedPage);
    await expect(
      authenticatedPage.getByTestId("expanded-row-1-to-3"),
    ).toBeVisible();
  });

  test("should be possible to re-collapse rows through the drawer", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage
      .getByTestId("skipped-lines-row-1-3")
      .getByRole("button", { name: "All" })
      .click();
    await expect(
      authenticatedPage.getByTestId("skipped-lines-row-1-3"),
    ).toBeHidden();

    await helpers.toggleDrawer(authenticatedPage);
    await authenticatedPage
      .getByTestId("expanded-row-1-to-3")
      .locator(`[aria-label="Delete range"]`)
      .click();
    await expect(
      authenticatedPage.getByTestId("skipped-lines-row-1-3"),
    ).toBeVisible();
  });
});

test.describe("pretty print", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
    await authenticatedPage.evaluate(() => {
      localStorage.setItem("pretty-print-bookmarks", "true");
    });
    await authenticatedPage.reload();
  });

  test("should pretty print bookmarks if pretty print is enabled", async ({
    authenticatedPage,
  }) => {
    const defaultRowHeight = 18;

    await expect(authenticatedPage.getByTestId("log-row-19")).toBeVisible();
    await authenticatedPage.getByTestId("log-row-19").dblclick({ force: true });
    const box = await authenticatedPage.getByTestId("log-row-19").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThan(defaultRowHeight);
  });
});

test.describe("Sharing lines", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("should present a share button with a menu when a line is selected", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("line-index-1").click();
    await expect(
      authenticatedPage.getByTestId("sharing-menu-button"),
    ).toBeVisible();
    await authenticatedPage.getByTestId("sharing-menu-button").click();
    await expect(authenticatedPage.getByTestId("sharing-menu")).toBeVisible();
  });

  test("shift+click selecting a range of lines should automatically open the sharing menu", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("line-index-1").click();
    await authenticatedPage
      .getByTestId("line-index-10")
      .click({ modifiers: ["Shift"] });
    await expect(authenticatedPage.getByTestId("sharing-menu")).toBeVisible();
  });

  test("should be able to copy the selected lines as JIRA format", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("line-index-1").click();
    await authenticatedPage
      .getByTestId("line-index-2")
      .click({ modifiers: ["Shift"] });
    await expect(authenticatedPage.getByTestId("sharing-menu")).toBeVisible();
    await expect(
      authenticatedPage.getByText("Copy selected contents"),
    ).toBeVisible();
    await authenticatedPage.getByText("Copy selected contents").click();
    await helpers.validateToast(
      authenticatedPage,
      "success",
      "Copied 2 lines to clipboard",
      true,
    );
    await helpers.assertValueCopiedToClipboard(
      authenticatedPage,
      "{noformat}\n+------------------------------------------+--------+-----+-----+\n|full_name                                 |name    |port |pid  |\n{noformat}",
    );
  });

  test("should be able to copy a link to the selected lines", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("line-index-1").click();
    await authenticatedPage
      .getByTestId("line-index-2")
      .click({ modifiers: ["Shift"] });
    await expect(authenticatedPage.getByTestId("sharing-menu")).toBeVisible();
    await expect(
      authenticatedPage.getByText("Copy share link to selected lines"),
    ).toBeVisible();
    await authenticatedPage
      .getByText("Copy share link to selected lines")
      .click();
    await helpers.validateToast(
      authenticatedPage,
      "success",
      "Copied link to clipboard",
      true,
    );
    await helpers.assertValueCopiedToClipboard(
      authenticatedPage,
      "http://localhost:5173/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab?bookmarks=0%2C12568&selectedLineRange=L1-L2&shareLine=1",
    );
  });

  test("should be able to limit the search range to the selected lines", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("line-index-1").click();
    await authenticatedPage
      .getByTestId("line-index-2")
      .click({ modifiers: ["Shift"] });
    await expect(authenticatedPage.getByTestId("sharing-menu")).toBeVisible();
    await expect(
      authenticatedPage.getByText("Only search on range"),
    ).toBeVisible();
    await authenticatedPage.getByText("Only search on range").click();
    await helpers.toggleDetailsPanel(authenticatedPage, true);
    await expect(
      authenticatedPage.getByTestId("range-lower-bound"),
    ).toHaveValue("1");
    await expect(
      authenticatedPage.getByTestId("range-upper-bound"),
    ).toHaveValue("2");
  });
});

test.describe("Exclude timestamps toggle", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("should disable the exclude timestamps toggle for resmoke logs", async ({
    authenticatedPage,
  }) => {
    await helpers.toggleDetailsPanel(authenticatedPage, true);
    await authenticatedPage.getByTestId("log-viewing-tab").click();
    await expect(
      authenticatedPage.getByTestId("exclude-timestamps-toggle"),
    ).toBeDisabled();
    await helpers.toggleDetailsPanel(authenticatedPage, false);
  });
});
