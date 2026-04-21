import { palette } from "@leafygreen-ui/palette";
import { SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL } from "constants/cookies";
import { test, expect } from "../../fixtures";
import {
  validateToast,
  validateDatePickerDate,
  selectDatePickerDate,
} from "../../helpers";

const { green, gray, blue } = palette;

// Helper function to convert hex to RGB
const hexToRGB = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

test.describe("task history", () => {
  const spruceTaskHistoryLink =
    "task/spruce_ubuntu1604_e2e_test_b0c52a750150b4f1f67e501bd3351a808939815c_1f7cf49f4ce587c74212d8997da171c4_22_03_10_15_19_05/history";

  const mciTaskHistoryLink =
    "/task/evg_lint_generate_lint_c6672b24d14c6d8cd51ce2c4b2b88b424aaacd64_25_03_27_14_56_09/history?execution=0";

  test.describe("navigation", () => {
    test("can view the task history tab", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(spruceTaskHistoryLink);
      await expect(page.getByTestId("task-history-tab")).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await expect(page.getByTestId("task-history")).toBeVisible();
    });
  });

  test.describe("task timeline", () => {
    test("can expand/collapse tasks", async ({ authenticatedPage: page }) => {
      await page.goto(spruceTaskHistoryLink);
      await page.getByTestId("expanded-option").click();
      await expect(page.getByTestId("timeline-box")).toHaveCount(13);
      await expect(
        page.getByTestId("task-timeline").getByTestId("collapsed-box"),
      ).toBeHidden();

      await page.getByTestId("collapsed-option").click();
      await expect(page.getByTestId("timeline-box")).toHaveCount(10);
      await expect(
        page.getByTestId("task-timeline").getByTestId("collapsed-box"),
      ).toHaveCount(2);
    });
  });

  test.describe("commit details list", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(spruceTaskHistoryLink);
    });

    test("can expand/collapse tasks", async ({ authenticatedPage: page }) => {
      await page.getByTestId("expanded-option").click();
      await expect(page.getByTestId("commit-details-card")).toHaveCount(13);
      await expect(
        page.getByTestId("commit-details-list").getByTestId("collapsed-card"),
      ).toBeHidden();

      await page.getByTestId("collapsed-option").click();
      await expect(page.getByTestId("commit-details-card")).toHaveCount(10);
      await expect(
        page.getByTestId("commit-details-list").getByTestId("collapsed-card"),
      ).toHaveCount(2);
    });

    test("can expand/collapse inactive tasks with the inactive commits button", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("commit-details-card")).toHaveCount(10);
      await expect(page.getByText("Order: 12380")).toBeHidden();

      const collapsedCardButton = page.getByTestId("collapsed-card").nth(0);
      await expect(
        collapsedCardButton.getByText("1 Inactive Commit"),
      ).toBeVisible();

      await collapsedCardButton.click();
      await expect(collapsedCardButton.getByText("1 Expanded")).toBeVisible();
      await expect(page.getByTestId("commit-details-card")).toHaveCount(11);
      await expect(page.getByText("Order: 1238")).toBeVisible();

      await collapsedCardButton.click();
      await expect(
        collapsedCardButton.getByText("1 Inactive Commit"),
      ).toBeVisible();
      await expect(page.getByTestId("commit-details-card")).toHaveCount(10);
      await expect(page.getByText("Order: 1238")).toBeHidden();
    });
  });

  test.describe("restarting tasks", () => {
    const successColor = hexToRGB(green.dark1);
    const willRunColor = hexToRGB(gray.dark1);

    test("restarting the task that is currently being viewed should reflect changes on UI and update the URL", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(spruceTaskHistoryLink);
      await expect(page).toHaveURL(/execution=0/);

      const firstTaskCard = page.getByTestId("commit-details-card").nth(0);
      const firstTaskBox = page.getByTestId("timeline-box").nth(0);

      await expect(firstTaskBox).toHaveCSS("background-color", successColor);
      await expect(firstTaskCard.getByTestId("execution-chip")).toBeHidden();
      await expect(firstTaskCard.getByTestId("restart-button")).toBeEnabled();
      await firstTaskCard.getByTestId("restart-button").click();
      await validateToast(page, "success", "Task scheduled to restart");

      await expect(page).toHaveURL(/execution=1/);
      await expect(firstTaskBox).toHaveCSS("background-color", willRunColor);
      await expect(firstTaskCard.getByTestId("execution-chip")).toBeVisible();
      await expect(firstTaskCard.getByTestId("restart-button")).toBeDisabled();
    });

    test("restarting a task that is not currently being viewed should reflect changes on UI, but not update the URL", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(spruceTaskHistoryLink);
      await expect(page).toHaveURL(/execution=0/);

      const secondTaskCard = page.getByTestId("commit-details-card").nth(1);
      const secondTaskBox = page.getByTestId("timeline-box").nth(1);

      await expect(secondTaskBox).toHaveCSS("background-color", successColor);
      await expect(secondTaskCard.getByTestId("execution-chip")).toBeHidden();
      await expect(secondTaskCard.getByTestId("restart-button")).toBeEnabled();
      await secondTaskCard.getByTestId("restart-button").click();
      await validateToast(page, "success", "Task scheduled to restart");

      await expect(page).not.toHaveURL(/execution=1/);
      await expect(secondTaskBox).toHaveCSS("background-color", willRunColor);
      await expect(secondTaskCard.getByTestId("execution-chip")).toBeVisible();
      await expect(secondTaskCard.getByTestId("restart-button")).toBeDisabled();
    });
  });

  test.describe("scheduling tasks", () => {
    const willRunColor = hexToRGB(gray.dark1);

    test("scheduling a task in a group of 1 inactive task", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(spruceTaskHistoryLink);

      // Target the 2nd task element in the task timeline and assert that it
      // changes from an inactive collapsed task to an active will-run task.
      const taskBoxes = page
        .getByTestId("task-timeline")
        .locator("div[data-cy]:not([data-cy='date-separator'])");
      const taskBox = taskBoxes.nth(2);
      await expect(taskBox).toHaveAttribute("data-cy", "collapsed-box");

      await page.getByText("1 Inactive Commit").click();
      const taskCard = page.getByTestId("commit-details-card").nth(2);
      await expect(taskCard.getByTestId("schedule-button")).toBeEnabled();
      await taskCard.getByTestId("schedule-button").click();
      await validateToast(page, "success", "Task scheduled to run");

      // Re-query for the task box after DOM updates
      const updatedTaskBox = taskBoxes.nth(2);
      await expect(updatedTaskBox).not.toHaveAttribute(
        "data-cy",
        "collapsed-box",
      );

      // Find the timeline box within the task timeline
      const scheduledTaskBox = page
        .getByTestId("task-timeline")
        .getByTestId("timeline-box")
        .nth(2);
      await expect(scheduledTaskBox).toBeVisible();
      await expect(scheduledTaskBox).toHaveCSS(
        "background-color",
        willRunColor,
      );

      await expect(page.getByText("1 Inactive Commit")).toBeHidden();
      await expect(taskCard.getByTestId("restart-button")).toBeVisible();
      await expect(taskCard.getByTestId("restart-button")).toBeDisabled();
    });

    test("scheduling a task in a group of multiple inactive tasks", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(spruceTaskHistoryLink);

      await page.getByText("2 Inactive Commit").click();
      await expect(page.getByText("2 Expanded")).toBeVisible();

      const taskCard = page.getByTestId("commit-details-card").nth(7);
      await expect(taskCard.getByTestId("schedule-button")).toBeEnabled();
      await taskCard.getByTestId("schedule-button").click();
      await validateToast(page, "success", "Task scheduled to run");

      // The other inactive task in the group should still be visible.
      await expect(page.getByText("1 Expanded")).toBeVisible();
      await expect(page.getByText("22ea5d7")).toBeVisible();
    });
  });

  test.describe("pagination", () => {
    test.describe("can paginate forwards and backwards", () => {
      test.beforeEach(async ({ page }) => {
        // Smaller viewport size to test commits going to next/prev pages.
        await page.setViewportSize({
          width: 1400,
          height: 1080,
        });
      });

      test("collapsed view", async ({ authenticatedPage: page }) => {
        await page.goto(mciTaskHistoryLink);
        const prevPageButton = page.getByRole("button", {
          name: "Previous page",
        });
        const nextPageButton = page.getByRole("button", { name: "Next page" });

        const collapsedViewPages = {
          first: { order: "12305", date: "Mar 27, 2025" },
          next: { order: "12236", date: "Mar 10, 2025" },
        };

        // Previous page should be disabled.
        await expect(prevPageButton).toBeDisabled();
        await expect(page.getByTestId("commit-details-card")).toHaveCount(21);
        await expect(
          page
            .getByTestId("commit-details-card")
            .nth(0)
            .getByText(collapsedViewPages.first.order),
        ).toBeVisible();
        await expect(
          page
            .getByTestId("horizontal-date-separator")
            .nth(0)
            .getByText(collapsedViewPages.first.date),
        ).toBeVisible();

        // Go to next page.
        await expect(nextPageButton).toBeEnabled();
        await nextPageButton.click();
        await expect(page.getByTestId("commit-details-card")).toHaveCount(19);
        await expect(
          page
            .getByTestId("commit-details-card")
            .nth(0)
            .getByText(collapsedViewPages.next.order),
        ).toBeVisible();
        await expect(
          page
            .getByTestId("horizontal-date-separator")
            .nth(0)
            .getByText(collapsedViewPages.next.date),
        ).toBeVisible();

        // Reached last page, next button should be disabled.
        await expect(nextPageButton).toBeDisabled();

        // Go to previous page.
        await expect(prevPageButton).toBeEnabled();
        await prevPageButton.click();
        await expect(page.getByTestId("commit-details-card")).toHaveCount(21);
        await expect(
          page
            .getByTestId("commit-details-card")
            .nth(0)
            .getByText(collapsedViewPages.first.order),
        ).toBeVisible();
        await expect(
          page
            .getByTestId("horizontal-date-separator")
            .nth(0)
            .getByText(collapsedViewPages.first.date),
        ).toBeVisible();
        // Reached first page, previous button should be disabled.
        await expect(prevPageButton).toBeDisabled();
      });

      test("expanded view", async ({ authenticatedPage: page }) => {
        await page.goto(mciTaskHistoryLink);
        await page.getByTestId("expanded-option").click();

        const prevPageButton = page.getByRole("button", {
          name: "Previous page",
        });
        const nextPageButton = page.getByRole("button", { name: "Next page" });

        const expandedViewPages = {
          first: { order: "12306", date: "Mar 27, 2025" },
          second: { order: "12261", date: "Mar 17, 2025" },
          third: { order: "12217", date: "Mar 5, 2025" },
          last: { order: "12170", date: "Feb 25, 2025" },
        };

        // Previous page should be disabled.
        await expect(prevPageButton).toBeDisabled();
        await expect(page.getByTestId("commit-details-card")).toHaveCount(45);
        await expect(
          page
            .getByTestId("commit-details-card")
            .nth(0)
            .getByText(expandedViewPages.first.order),
        ).toBeVisible();
        await expect(
          page
            .getByTestId("horizontal-date-separator")
            .nth(0)
            .getByText(expandedViewPages.first.date),
        ).toBeVisible();

        // Go to next page.
        await expect(nextPageButton).toBeEnabled();
        await nextPageButton.click();
        await expect(page.getByTestId("commit-details-card")).toHaveCount(44);
        await expect(
          page
            .getByTestId("commit-details-card")
            .nth(0)
            .getByText(expandedViewPages.second.order),
        ).toBeVisible();
        await expect(
          page
            .getByTestId("horizontal-date-separator")
            .nth(0)
            .getByText(expandedViewPages.second.date),
        ).toBeVisible();

        // Go to next page.
        await expect(nextPageButton).toBeEnabled();
        await nextPageButton.click();
        await expect(page.getByTestId("commit-details-card")).toHaveCount(47);
        await expect(
          page
            .getByTestId("commit-details-card")
            .nth(0)
            .getByText(expandedViewPages.third.order),
        ).toBeVisible();
        await expect(
          page
            .getByTestId("horizontal-date-separator")
            .nth(0)
            .getByText(expandedViewPages.third.date),
        ).toBeVisible();

        // Go to next page.
        await expect(nextPageButton).toBeEnabled();
        await nextPageButton.click();
        await expect(page.getByTestId("commit-details-card")).toHaveCount(14);
        await expect(
          page
            .getByTestId("commit-details-card")
            .nth(0)
            .getByText(expandedViewPages.last.order),
        ).toBeVisible();
        await expect(
          page
            .getByTestId("horizontal-date-separator")
            .nth(0)
            .getByText(expandedViewPages.last.date),
        ).toBeVisible();

        // Reached last page, next button should be disabled.
        await expect(nextPageButton).toBeDisabled();

        // Go to previous page.
        await expect(prevPageButton).toBeEnabled();
        await prevPageButton.click();
        await expect(page.getByTestId("commit-details-card")).toHaveCount(47);
        await expect(
          page
            .getByTestId("commit-details-card")
            .nth(0)
            .getByText(expandedViewPages.third.order),
        ).toBeVisible();

        // Go to previous page.
        await expect(prevPageButton).toBeEnabled();
        await prevPageButton.click();
        await expect(page.getByTestId("commit-details-card")).toHaveCount(44);
        await expect(
          page
            .getByTestId("commit-details-card")
            .nth(0)
            .getByText(expandedViewPages.second.order),
        ).toBeVisible();

        // Go to previous page.
        await expect(prevPageButton).toBeEnabled();
        await prevPageButton.click();
        await expect(page.getByTestId("commit-details-card")).toHaveCount(45);
        await expect(
          page
            .getByTestId("commit-details-card")
            .nth(0)
            .getByText(expandedViewPages.first.order),
        ).toBeVisible();

        // Reached first page, previous button should be disabled.
        await expect(prevPageButton).toBeDisabled();
      });
    });

    test("paging backwards to the first page should show a full page of results", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        "/task/evg_lint_generate_lint_14499175e85a5b550dfb5bb6067fce4ecf7fcd15_25_03_26_19_23_35/history?execution=0",
      );
      const prevPageButton = page.getByRole("button", {
        name: "Previous page",
      });
      await expect(prevPageButton).toBeEnabled();
      await prevPageButton.click();

      // We shouldn't just show the single activated task that appears before this one.
      await expect(page.getByTestId("timeline-box")).toHaveCount(19);
      await expect(prevPageButton).toBeDisabled();
    });
  });

  test.describe("date filter", () => {
    test("can filter by date correctly with default timezone", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(mciTaskHistoryLink);
      await page.getByTestId("expanded-option").click();

      await selectDatePickerDate(page, "2025", "Feb", "2025-02-28");
      await expect(page).toHaveURL(/2025-02-28/);
      await validateDatePickerDate(page, "date-picker", {
        year: "2025",
        month: "02",
        day: "28",
      });
      await expect(
        page
          .getByTestId("commit-details-card")
          .nth(0)
          .getByText("Remove userSettings query"),
      ).toBeVisible();
    });

    test("can filter by date correctly with different timezone", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/preferences");
      await page.getByText("Select a timezone").click();
      const timezoneOption = page.getByText("Japan, South Korea");
      await expect(timezoneOption).toBeVisible();
      await timezoneOption.click();
      await page.getByRole("button", { name: "Save changes" }).click();

      await page.goto(mciTaskHistoryLink);
      await page.getByTestId("expanded-option").click();

      await selectDatePickerDate(page, "2025", "Feb", "2025-02-28");
      await expect(page).toHaveURL(/2025-02-28/);
      await validateDatePickerDate(page, "date-picker", {
        year: "2025",
        month: "02",
        day: "28",
      });
      await expect(
        page
          .getByTestId("commit-details-card")
          .nth(0)
          .getByText("Flush logger after running check run"),
      ).toBeVisible();
    });

    test("date is cleared when paginating", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`${mciTaskHistoryLink}&date=2025-02-28`);
      await page.getByTestId("expanded-option").click();
      await validateDatePickerDate(page, "date-picker", {
        year: "2025",
        month: "02",
        day: "28",
      });
      await expect(
        page
          .getByTestId("commit-details-card")
          .nth(0)
          .getByText("Remove userSettings query"),
      ).toBeVisible();

      const prevPageButton = page.getByRole("button", {
        name: "Previous page",
      });
      await expect(prevPageButton).toBeEnabled();
      await prevPageButton.click();
      await expect(
        page
          .getByTestId("commit-details-card")
          .nth(0)
          .getByText("Remove userSettings query"),
      ).toBeHidden();
      await validateDatePickerDate(page, "date-picker");
      await expect(page).not.toHaveURL(/date/);
    });
  });

  test.describe("jumping to current task", () => {
    test("can return to the current task after paginating", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(mciTaskHistoryLink);
      await page.getByTestId("expanded-option").click();
      const firstTaskCard = page.getByTestId("commit-details-card").nth(0);
      await expect(firstTaskCard.getByText("Order: 12306")).toBeVisible();

      await page.getByRole("button", { name: "Next page" }).click();
      await expect(firstTaskCard.getByText("Order: 12306")).toBeHidden();

      await page.getByTestId("jump-to-this-task-button").click();
      await expect(firstTaskCard.getByText("Order: 12306")).toBeVisible();
    });

    test("can return to the current task after filtering by date", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(mciTaskHistoryLink);
      await page.getByTestId("expanded-option").click();
      const firstTaskCard = page.getByTestId("commit-details-card").nth(0);
      await expect(firstTaskCard.getByText("Order: 12306")).toBeVisible();

      await selectDatePickerDate(page, "2025", "Feb", "2025-02-28");
      await expect(firstTaskCard.getByText("Order: 12306")).toBeHidden();

      await page.getByTestId("jump-to-this-task-button").click();
      await expect(firstTaskCard.getByText("Order: 12306")).toBeVisible();
    });
  });

  test.describe("test failure search", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(
        "task/evergreen_ubuntu1604_test_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/history",
      );
    });

    test("should update the URL correctly", async ({
      authenticatedPage: page,
    }) => {
      const searchInput = page.getByPlaceholder("Search failed test");
      await searchInput.fill("faketest");
      await expect(page).toHaveURL(/failing_test=faketest/);
    });

    test("unmatching search results are opaque", async ({
      authenticatedPage: page,
    }) => {
      const searchInput = page.getByPlaceholder("Search failed test");
      await searchInput.fill("faketest");
      await expect(page.getByTestId("commit-details-card").nth(0)).toHaveCSS(
        "opacity",
        "1",
      );
      await expect(page.getByTestId("commit-details-card").nth(1)).toHaveCSS(
        "opacity",
        "0.4",
      );
      await searchInput.clear();
      await expect(page.getByTestId("commit-details-card").nth(1)).toHaveCSS(
        "opacity",
        "1",
      );
    });

    test("no results found message is shown when no tasks match the search term", async ({
      authenticatedPage: page,
    }) => {
      const searchInput = page.getByPlaceholder("Search failed test");
      await searchInput.fill("artseinrst");
      await expect(page.getByText("No results on this page")).toBeVisible();
    });
  });

  test.describe("failing tests table", () => {
    const failingTestLink =
      "/task/evg_lint_generate_lint_ecbbf17f49224235d43416ea55566f3b1894bbf7_25_03_21_21_09_20/history?execution=0";

    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(failingTestLink);
    });

    test("table can be expanded", async ({ authenticatedPage: page }) => {
      const firstCard = page.getByTestId("commit-details-card").nth(0);
      await expect(
        firstCard.getByTestId("failing-tests-changes-table"),
      ).toBeHidden();
      await firstCard.getByLabel("Accordion icon").click();
      await expect(
        firstCard.getByTestId("failing-tests-changes-table"),
      ).toBeVisible();
      await expect(
        firstCard.getByTestId("failing-tests-table-row"),
      ).toHaveCount(3);
    });

    test("can filter within the table", async ({ authenticatedPage: page }) => {
      await expect(
        page.getByTestId("failing-tests-changes-table"),
      ).toBeHidden();
      await page.getByLabel("Accordion icon").click();
      await expect(
        page.getByTestId("failing-tests-changes-table"),
      ).toBeVisible();
      await expect(page.getByTestId("failing-tests-table-row")).toHaveCount(3);

      await page.getByTestId("test-name-filter").click();

      await page.getByPlaceholder("Test name").fill("test_lint_1");
      await page.getByPlaceholder("Test name").press("Enter");
      await expect(page.getByTestId("failing-tests-table-row")).toHaveCount(1);

      await page.getByTestId("test-name-filter").click();
      await page.getByPlaceholder("Test name").clear();
      await page.getByPlaceholder("Test name").press("Enter");
      await expect(page.getByTestId("failing-tests-table-row")).toHaveCount(3);
    });

    test("clicking 'Search Failure' button'", async ({
      authenticatedPage: page,
    }) => {
      const firstCard = page.getByTestId("commit-details-card").nth(0);
      await expect(
        firstCard.getByTestId("failing-tests-changes-table"),
      ).toBeHidden();
      await firstCard.getByLabel("Accordion icon").click();
      await expect(
        firstCard.getByTestId("failing-tests-changes-table"),
      ).toBeVisible();
      await expect(
        firstCard.getByTestId("failing-tests-table-row"),
      ).toHaveCount(3);

      await firstCard
        .getByTestId("failing-tests-table-row")
        .nth(0)
        .getByRole("button", { name: "Search Failure" })
        .click();

      await expect(page).toHaveURL(/failing_test=test_lint_1/);
      await expect(page.getByPlaceholder("Search failed test")).toHaveValue(
        "test_lint_1",
      );
    });
  });

  test.describe("onboarding", () => {
    test("can go through all steps of the walkthrough", async ({
      authenticatedPage: page,
      context,
    }) => {
      await context.clearCookies({
        name: SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL,
      });
      await page.goto(mciTaskHistoryLink);

      await expect(page.getByTestId("walkthrough-backdrop")).toBeVisible();
      await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
      await expect(
        page.getByText("Introducing the Task History Tab"),
      ).toBeVisible();

      const nextButton = page
        .getByTestId("walkthrough-guide-cue")
        .getByRole("button", { name: "Next" });

      await nextButton.click();
      await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();

      await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
      await expect(
        page.getByTestId("walkthrough-guide-cue").getByText("Task Timeline"),
      ).toBeVisible();
      await nextButton.click();
      await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();

      await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
      await expect(
        page.getByTestId("walkthrough-guide-cue").getByText("View Options"),
      ).toBeVisible();
      await nextButton.click();
      await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();

      await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
      await expect(
        page.getByTestId("walkthrough-guide-cue").getByText("Commit Details"),
      ).toBeVisible();
      await nextButton.click();
      await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();

      await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
      await expect(
        page
          .getByTestId("walkthrough-guide-cue")
          .getByText("Search Test Failures"),
      ).toBeVisible();
      await nextButton.click();
      await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();

      await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
      await expect(
        page.getByTestId("walkthrough-guide-cue").getByText("Filter by Date"),
      ).toBeVisible();
      await nextButton.click();
      await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();

      await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
      await expect(
        page
          .getByTestId("walkthrough-guide-cue")
          .getByText("Jump to Current Task"),
      ).toBeVisible();
      await page.getByRole("button", { name: "Get started" }).click();

      await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();
      await expect(page.getByTestId("walkthrough-backdrop")).toBeHidden();
    });

    test("can end walkthrough early using the dismiss button", async ({
      authenticatedPage: page,
      context,
    }) => {
      await context.clearCookies({
        name: SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL,
      });
      await page.goto(mciTaskHistoryLink);

      await expect(page.getByTestId("walkthrough-backdrop")).toBeVisible();
      await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
      await expect(
        page.getByText("Introducing the Task History Tab"),
      ).toBeVisible();

      const closeButton = page.getByLabel("Close Tooltip");
      await expect(closeButton).toBeVisible();
      await closeButton.click();
      await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();
      await expect(page.getByTestId("walkthrough-backdrop")).toBeHidden();
    });
  });

  test.describe("hover and click interactions", () => {
    const selectedColor = hexToRGB(blue.base);

    test("hovering on commit cards highlight the corresponding task box", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(mciTaskHistoryLink);
      const taskCard = page.getByTestId("commit-details-card").nth(1);
      const taskBox = page.getByTestId("timeline-box").nth(1);

      await taskCard.hover();
      await expect(taskBox).toHaveCSS("border-color", selectedColor);
    });

    test("clicking on task box should highlight and scroll to the commit card", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(mciTaskHistoryLink);
      const taskCard = page.getByTestId("commit-details-card").nth(10);
      const taskBox = page.getByTestId("timeline-box").nth(10);

      await taskBox.click();
      await expect(taskBox).toHaveCSS("border-color", selectedColor);
      await expect(taskCard).toBeVisible();
      await expect(taskCard).toHaveCSS("border-color", selectedColor);
    });
  });

  test.describe("historical task timing", () => {
    test("allows configuring a task timing link", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(mciTaskHistoryLink);

      const configButton = page.getByRole("button", {
        name: "Config",
        exact: true,
      });
      await configButton.click();
      await page.getByText("Only include successful runs").click();
      const checkbox = page.getByLabel("Only include successful runs");
      await expect(checkbox).toBeChecked();
      await configButton.click();
      const link = page.getByRole("link", { name: "Activated → Finish" });
      await expect(link).toHaveAttribute("href", /success/);
    });
  });
});
