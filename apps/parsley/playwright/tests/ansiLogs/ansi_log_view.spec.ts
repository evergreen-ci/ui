import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

const logLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

test.describe("Basic evergreen log view", () => {
  const longLogLine = `[2022/03/02 17:02:18.500] warning Pattern ["@apollo/client@latest"] is trying to unpack in the same destination "/home/ubuntu/.cache/yarn/v6/npm-@apollo-client-3.3.7-f15bf961dc0c2bee37a47bf86b8881fdc6183810-integrity/node_modules/@apollo/client" as pattern ["@apollo/client@3.3.7"]. This could result in non-deterministic behavior, skipping.`;

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("should render ansi lines", async ({ authenticatedPage }) => {
    const ansiRows = authenticatedPage.getByTestId("ansi-row");
    await ansiRows.first().waitFor();
    expect(await ansiRows.count()).toBeGreaterThan(0);
  });

  test("by default should have wrapping turned off and should be able to scroll horizontally", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage.getByTestId("log-row-22")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-22")).toContainText(
      longLogLine,
    );
    await helpers.isNotContainedInViewport(
      authenticatedPage,
      "[data-cy=log-row-22]",
    );

    await helpers
      .getByDataCy(authenticatedPage, "paginated-virtual-list")
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
    await expect(authenticatedPage.getByTestId("log-row-22")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-22")).toContainText(
      longLogLine,
    );
    await helpers.isContainedInViewport(
      authenticatedPage,
      "[data-cy=log-row-22]",
    );
  });

  test("should still allow horizontal scrolling when there are few logs on screen", async ({
    authenticatedPage,
  }) => {
    await helpers.addFilter(authenticatedPage, "Putting spruce/");

    await helpers
      .getByDataCy(authenticatedPage, "paginated-virtual-list")
      .evaluate((el) => {
        el.scrollTo(el.scrollWidth, 0);
      });
  });

  test("log header should show the task breadcrumbs and status and link to Spruce", async ({
    authenticatedPage,
  }) => {
    await expect(
      authenticatedPage.getByTestId("project-breadcrumb"),
    ).toContainText("spruce");

    await expect(
      authenticatedPage.getByTestId("version-breadcrumb"),
    ).toContainText("2c9056d");
    await authenticatedPage.getByTestId("version-breadcrumb").hover();
    await expect(
      authenticatedPage.getByTestId("breadcrumb-tooltip"),
    ).toBeVisible();
    await expect(
      authenticatedPage.getByTestId("breadcrumb-tooltip"),
    ).toContainText(
      "EVG-14749: Add loading state for JIRA Issues and Suspected Issues (#1120)",
    );
    await authenticatedPage.mouse.move(0, 0);

    await expect(
      authenticatedPage.getByTestId("task-breadcrumb"),
    ).toContainText("test");
    await expect(
      authenticatedPage.getByTestId("task-breadcrumb"),
    ).toHaveAttribute(
      "href",
      "http://localhost:9090/task/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0?redirect_spruce_users=true",
    );
    await expect(
      authenticatedPage.getByTestId("task-status-badge"),
    ).toContainText("Succeeded");
    await expect(authenticatedPage.getByTestId("test-breadcrumb")).toBeHidden();
  });
});

test.describe("Bookmarking and selecting lines", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("should default to bookmarking 0 and the last log line on load", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,297/);
    await expect(authenticatedPage.getByTestId("bookmark-list")).toContainText(
      "0",
    );
    await expect(authenticatedPage.getByTestId("bookmark-list")).toContainText(
      "297",
    );
  });

  test("should be able to bookmark and unbookmark log lines", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("log-row-4").dblclick();
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,4,297/);
    await expect(authenticatedPage.getByTestId("bookmark-list")).toContainText(
      "0",
    );
    await expect(authenticatedPage.getByTestId("bookmark-list")).toContainText(
      "4",
    );
    await expect(authenticatedPage.getByTestId("bookmark-list")).toContainText(
      "297",
    );
    await authenticatedPage.getByTestId("log-row-4").dblclick();
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,297/);
    const bookmarkList = await helpers
      .getByDataCy(authenticatedPage, "bookmark-list")
      .innerText();
    expect(bookmarkList).not.toContain("4");
  });

  test("should be able to set and unset the share line", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("log-link-5").click();
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,297&shareLine=5/);
    await expect(authenticatedPage.getByTestId("bookmark-list")).toContainText(
      "0",
    );
    await expect(authenticatedPage.getByTestId("bookmark-list")).toContainText(
      "5",
    );
    await expect(authenticatedPage.getByTestId("bookmark-list")).toContainText(
      "297",
    );
    await authenticatedPage.getByTestId("log-link-5").click();
    await expect(authenticatedPage).toHaveURL(/\?bookmarks=0,297/);
    const bookmarkList = await helpers
      .getByDataCy(authenticatedPage, "bookmark-list")
      .innerText();
    expect(bookmarkList).not.toContain("5");
  });

  test("should be able to copy bookmarks as JIRA format", async ({
    authenticatedPage,
  }) => {
    await helpers
      .getByDataCy(authenticatedPage, "log-row-10")
      .dblclick({ force: true });
    await helpers
      .getByDataCy(authenticatedPage, "log-row-11")
      .dblclick({ force: true });

    const logLine0 =
      "[2022/03/02 17:01:58.587] Task logger initialized (agent version 2022-02-14 from 00a4c8f3e8e4559cc23e04a019b6d1725c40c3e5).";
    const logLine10 =
      "[2022/03/02 17:02:01.610] e391612 EVG-16049 Update spruce project page for admin only variables (#1114)";
    const logLine11 =
      "[2022/03/02 17:02:01.610] 04a52b2 EVG-15959 Fix rerender method in test utils (#1118)";
    const logLine297 =
      "[2022/03/02 17:05:21.050] running setup group because we have a new independent task";

    await helpers.toggleDetailsPanel(authenticatedPage, true);
    await authenticatedPage.getByRole("button", { name: "Copy Jira" }).click();
    await helpers.assertValueCopiedToClipboard(
      authenticatedPage,
      `{noformat}\n${logLine0}\n...\n${logLine10}\n${logLine11}\n...\n${logLine297}\n{noformat}`,
    );
  });

  test("should be able to copy bookmarks as raw format", async ({
    authenticatedPage,
  }) => {
    await helpers
      .getByDataCy(authenticatedPage, "log-row-10")
      .dblclick({ force: true });
    await helpers
      .getByDataCy(authenticatedPage, "log-row-11")
      .dblclick({ force: true });

    const logLine0 =
      "[2022/03/02 17:01:58.587] Task logger initialized (agent version 2022-02-14 from 00a4c8f3e8e4559cc23e04a019b6d1725c40c3e5).";
    const logLine10 =
      "[2022/03/02 17:02:01.610] e391612 EVG-16049 Update spruce project page for admin only variables (#1114)";
    const logLine11 =
      "[2022/03/02 17:02:01.610] 04a52b2 EVG-15959 Fix rerender method in test utils (#1118)";
    const logLine297 =
      "[2022/03/02 17:05:21.050] running setup group because we have a new independent task";

    await helpers.toggleDetailsPanel(authenticatedPage, true);

    const moreOptionsButton = authenticatedPage.locator(
      `[aria-label='More options']`,
    );
    await moreOptionsButton.click();
    await expect(authenticatedPage.getByText("Copy raw")).toBeVisible();
    await authenticatedPage.getByText("Copy raw").click();
    await helpers.assertValueCopiedToClipboard(
      authenticatedPage,
      `${logLine0}\n...\n${logLine10}\n${logLine11}\n...\n${logLine297}\n`,
    );
  });

  test("should be able to clear bookmarks", async ({ authenticatedPage }) => {
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
    await helpers
      .getByDataCy(authenticatedPage, "log-row-4")
      .dblclick({ force: true });
    await expect(authenticatedPage.getByTestId("bookmark-4")).toBeVisible();

    await authenticatedPage.getByTestId("bookmark-297").click();
    await expect(authenticatedPage.getByTestId("log-row-297")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-4")).toBeHidden();
    await authenticatedPage.getByTestId("bookmark-4").click();
    await expect(authenticatedPage.getByTestId("log-row-4")).toBeVisible();
  });

  test("should be able to use the bookmarks bar to jump to a line when there are collapsed rows", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(`${logLink}?filters=100pass`);
    await helpers
      .getByDataCy(authenticatedPage, "log-row-56")
      .dblclick({ force: true });
    await expect(authenticatedPage.getByTestId("bookmark-56")).toBeVisible();

    await authenticatedPage.getByTestId("bookmark-297").click();
    await expect(authenticatedPage.getByTestId("log-row-297")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-56")).toBeHidden();
    await authenticatedPage.getByTestId("bookmark-56").click();
    await expect(authenticatedPage.getByTestId("log-row-56")).toBeVisible();
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
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task?bookmarks=0,297&filters=100evg";

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLinkWithFilters);
  });

  test("should be able to expand collapsed rows", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage.getByTestId("log-row-1")).toBeHidden();
    await expect(authenticatedPage.getByTestId("log-row-2")).toBeHidden();
    await expect(authenticatedPage.getByTestId("log-row-3")).toBeHidden();
    await expect(authenticatedPage.getByTestId("log-row-4")).toBeHidden();

    await helpers
      .getByDataCy(authenticatedPage, "skipped-lines-row-1-4")
      .getByRole("button", { name: "All" })
      .click();

    await expect(
      authenticatedPage.getByTestId("skipped-lines-row-1-4"),
    ).toBeHidden();
    await expect(authenticatedPage.getByTestId("log-row-1")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-2")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-3")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-4")).toBeVisible();
  });

  test("should be able to see what rows have been expanded in the drawer", async ({
    authenticatedPage,
  }) => {
    await helpers
      .getByDataCy(authenticatedPage, "skipped-lines-row-1-4")
      .getByRole("button", { name: "All" })
      .click();
    await helpers.toggleDrawer(authenticatedPage);
    await expect(
      authenticatedPage.getByTestId("expanded-row-1-to-4"),
    ).toBeVisible();
  });

  test("should be possible to re-collapse rows through the drawer", async ({
    authenticatedPage,
  }) => {
    await helpers
      .getByDataCy(authenticatedPage, "skipped-lines-row-1-4")
      .getByRole("button", { name: "All" })
      .click();
    await expect(
      authenticatedPage.getByTestId("skipped-lines-row-1-4"),
    ).toBeHidden();

    await helpers.toggleDrawer(authenticatedPage);
    await helpers
      .getByDataCy(authenticatedPage, "expanded-row-1-to-4")
      .locator(`[aria-label="Delete range"]`)
      .click();
    await expect(
      authenticatedPage.getByTestId("skipped-lines-row-1-4"),
    ).toBeVisible();
  });
});

test.describe("Sharing lines", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
    await expect(authenticatedPage.getByTestId("line-index-1")).toBeVisible();
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
    await helpers
      .getByDataCy(authenticatedPage, "line-index-10")
      .click({ modifiers: ["Shift"] });
    await expect(authenticatedPage.getByTestId("sharing-menu")).toBeVisible();
  });

  test("should be able to copy the selected lines as JIRA format", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("line-index-1").click();
    await helpers
      .getByDataCy(authenticatedPage, "line-index-2")
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
      "{noformat}\n[2022/03/02 17:01:58.587] Starting task spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12, execution 0.\n[2022/03/02 17:01:58.701] Running pre-task commands.\n{noformat}",
    );
  });

  test("should be able to copy a link to the selected lines", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("line-index-1").click();
    await helpers
      .getByDataCy(authenticatedPage, "line-index-2")
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
      "http://localhost:5173/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task?bookmarks=0%2C297&selectedLineRange=L1-L2&shareLine=1",
    );
  });

  test("should be able to limit the search range to the selected lines", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("line-index-1").click();
    await helpers
      .getByDataCy(authenticatedPage, "line-index-2")
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

test.describe("jump to failing log line", () => {
  const failingLogLink =
    "/evergreen/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/task";

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(failingLogLink);
  });

  test("should jump to failing log line based on user setting", async ({
    authenticatedPage,
  }) => {
    await helpers.clickToggle(
      authenticatedPage,
      "jump-to-failing-line-toggle",
      false,
      "log-viewing",
    );
    await authenticatedPage.reload();
    await expect(authenticatedPage.getByTestId("bookmark-list")).toContainText(
      "9614",
    );
    await expect(authenticatedPage.getByTestId("log-row-0")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-9614")).toBeHidden();

    await helpers.clickToggle(
      authenticatedPage,
      "jump-to-failing-line-toggle",
      true,
      "log-viewing",
    );
    await authenticatedPage.reload();
    await expect(authenticatedPage.getByTestId("bookmark-list")).toContainText(
      "9614",
    );
    await expect(authenticatedPage.getByTestId("log-row-9614")).toBeVisible();
    await expect(authenticatedPage.getByTestId("log-row-0")).toBeHidden();
  });
});

test.describe("sections", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("Can enable/disable sections", async ({ authenticatedPage }) => {
    await helpers.toggleDetailsPanel(authenticatedPage, true);
    await authenticatedPage.getByTestId("log-viewing-tab").click();
    await expect(
      authenticatedPage.getByTestId("sections-toggle"),
    ).toBeEnabled();
    await expect(
      authenticatedPage.getByTestId("sections-toggle"),
    ).toHaveAttribute("aria-checked", "false");
    await authenticatedPage.getByTestId("sections-toggle").click();
    await expect(
      authenticatedPage.getByTestId("sections-toggle"),
    ).toHaveAttribute("aria-checked", "true");
    await authenticatedPage.getByTestId("sections-toggle").click();
    await expect(
      authenticatedPage.getByTestId("sections-toggle"),
    ).toHaveAttribute("aria-checked", "false");
  });
});
