import { Page } from "@playwright/test";
import { SEEN_TASK_REVIEW_TOOLTIP } from "constants/cookies";
import { test, expect } from "../../fixtures";
import { clickLabelForLocator } from "../../helpers";

const pathTasks = "/version/5e4ff3abe3c3317e352062e4/tasks";
const patchDescriptionTasksExist = "dist";

const firstTaskId =
  "evergreen_ubuntu1604_test_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const displayTaskId = "evergreen_ubuntu1604_89";
const executionTaskId1 = "exec1";
const executionTaskId2 = "exec2";

const waitForTaskTable = async (page: Page) => {
  const table = page.getByTestId("tasks-table");
  await expect(table).toBeVisible();
  await expect(table).not.toHaveAttribute("data-loading", "true");
};

test.describe("Task table", () => {
  test("Loading skeleton does not persist when you navigate to Patch page from My Patches and adjust a filter", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/user/patches");
    await page
      .getByTestId("patch-card-patch-link")
      .filter({ hasText: patchDescriptionTasksExist })
      .click();
    await expect(page.getByTestId("tasks-table")).toBeVisible();
  });

  test("Updates sorting in the url when column headers are clicked", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(pathTasks);
    await waitForTaskTable(page);
    await expect(page.getByTestId("tasks-table-row").first()).toBeVisible();
    await expect(page).toHaveURL(/sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC/);

    const nameSortControl = page.getByRole("button", { name: "Sort by Name" });
    const statusSortControl = page.getByRole("button", {
      name: "Sort by Task Status",
    });
    const baseStatusSortControl = page.getByRole("button", {
      name: "Sort by Previous Status",
    });
    const variantSortControl = page.getByRole("button", {
      name: "Sort by Variant",
    });

    await nameSortControl.click();
    await expect(page).toHaveURL(/BASE_STATUS%3ADESC%3BNAME%3AASC/);

    await variantSortControl.click();
    await expect(page).toHaveURL(/sorts=NAME%3AASC%3BVARIANT%3AASC/);

    await statusSortControl.click();
    await expect(page).toHaveURL(/sorts=VARIANT%3AASC%3BSTATUS%3AASC/);

    await baseStatusSortControl.click();
    await expect(page).toHaveURL(/sorts=STATUS%3AASC%3BBASE_STATUS%3AASC/);

    await baseStatusSortControl.click();
    await expect(page).toHaveURL(/sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC/);

    await baseStatusSortControl.click();
    await expect(page).toHaveURL(/sorts=STATUS%3AASC/);
  });

  test("Clicking task name goes to task page for that task", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(pathTasks);
    await expect(
      page.getByTestId("tasks-table-row").first().locator("a").first(),
    ).toHaveAttribute("href", /\/task/);
  });

  test("Task count displays total tasks", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(pathTasks);
    await expect(page.getByTestId("total-count").first()).toContainText("49");
  });

  test.describe("Changing page number", () => {
    test("Displays the next page of results and updates URL when right arrow is clicked and next page exists", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`${pathTasks}?page=0`);
      await expect(page.getByTestId("tasks-table-row").first()).toBeVisible();

      const firstPageText = await page
        .getByTestId("tasks-table-row")
        .first()
        .textContent();
      await page.getByTestId("next-page-button").click();
      await expect(page.getByTestId("tasks-table-row").first()).toBeVisible();
      const secondPageText = page.getByTestId("tasks-table-row").first();
      await expect(secondPageText).not.toHaveText(firstPageText!);
    });

    test("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`${pathTasks}?page=1`);
      await expect(page.getByTestId("tasks-table-row").first()).toBeVisible();
      const secondPageText = await page
        .getByTestId("tasks-table-row")
        .first()
        .textContent();
      await page.getByTestId("prev-page-button").click();
      await expect(page.getByTestId("tasks-table-row").first()).toBeVisible();
      const firstPageText = page.getByTestId("tasks-table-row").first();
      await expect(firstPageText).not.toHaveText(secondPageText!);
    });

    test("Does not update results or URL when left arrow is clicked and previous page does not exist", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`${pathTasks}?page=0`);
      await expect(page.getByTestId("tasks-table-row").first()).toBeVisible();
      await expect(page.getByTestId("prev-page-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    test("Does not update results or URL when right arrow is clicked and next page does not exist", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`${pathTasks}?page=4`);
      await expect(page.getByTestId("tasks-table-row").first()).toBeVisible();
      await expect(page.getByTestId("next-page-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });
  });

  test.describe("blocked tasks", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(`${pathTasks}?limit=100`);
      await waitForTaskTable(page);
    });

    test("shows the blocking tasks when hovering over status badge", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("depends-on-tooltip")).toHaveCount(0);
      await page.getByTestId("task-status-badge").getByText("Blocked").hover();
      await expect(page.getByTestId("depends-on-tooltip")).toBeVisible();
      await expect(page.getByTestId("depends-on-tooltip")).toContainText(
        `Depends on tasks: “test-migrations”, “test-graphql”`,
      );
    });
  });

  test.describe("task review", () => {
    // Clicks the label associated with a reviewed checkbox (the input itself is hidden).
    const clickReviewed = async (page: Page, testId: string) => {
      await clickLabelForLocator(page.getByTestId(testId));
    };

    test("marks tasks as viewed and preserves their state on reload", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(pathTasks);
      await clickReviewed(page, `reviewed-${firstTaskId}`);
      await expect(page.getByTestId(`reviewed-${firstTaskId}`)).toBeChecked();

      await page.getByRole("button", { name: "Expand row" }).click();
      await expect(
        page.getByTestId(`reviewed-${executionTaskId1}`),
      ).toHaveAttribute("aria-disabled", "true");
      await clickReviewed(page, `reviewed-${executionTaskId2}`);
      await expect(page.getByTestId(`reviewed-${displayTaskId}`)).toBeChecked();
      await clickReviewed(page, `reviewed-${displayTaskId}`);
      await expect(
        page.getByTestId(`reviewed-${displayTaskId}`),
      ).not.toBeChecked();
      await expect(
        page.getByTestId(`reviewed-${executionTaskId2}`),
      ).not.toBeChecked();
      await clickReviewed(page, `reviewed-${displayTaskId}`);
      await expect(page.getByTestId(`reviewed-${displayTaskId}`)).toBeChecked();
      await expect(
        page.getByTestId(`reviewed-${executionTaskId2}`),
      ).toBeChecked();

      await page.reload();

      await expect(page.getByTestId(`reviewed-${firstTaskId}`)).toBeChecked();
      await expect(page.getByTestId(`reviewed-${displayTaskId}`)).toBeChecked();
      await page.getByRole("button", { name: "Expand row" }).click();
      await expect(
        page.getByTestId(`reviewed-${executionTaskId2}`),
      ).toBeChecked();
    });

    test.describe("announcement tooltip", () => {
      test.beforeEach(async ({ authenticatedPage: page }) => {
        await page.context().clearCookies({ name: SEEN_TASK_REVIEW_TOOLTIP });
        await page.goto(pathTasks);
        await waitForTaskTable(page);
      });

      test("shows the announcement tooltip open on the first viewing", async ({
        authenticatedPage: page,
      }) => {
        await expect(page.getByText("New feature: Task Review")).toBeVisible();
      });

      test("shows the info icon one day after the initial close and hides it after one week", async ({
        authenticatedPage: page,
      }) => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await page.context().addCookies([
          {
            name: SEEN_TASK_REVIEW_TOOLTIP,
            value: oneDayAgo.toString(),
            domain: "localhost",
            path: "/",
          },
        ]);
        await page.goto(pathTasks);
        await expect(page.getByText("Reviewed")).toBeVisible();
        await expect(page.getByText("New feature: Task Review")).toBeHidden();
        await page.getByTestId("announcement-tooltip-trigger").click();

        const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
        await page.context().addCookies([
          {
            name: SEEN_TASK_REVIEW_TOOLTIP,
            value: eightDaysAgo.toString(),
            domain: "localhost",
            path: "/",
          },
        ]);
        await page.goto(pathTasks);
        await expect(page.getByText("Reviewed")).toBeVisible();
        await expect(page.getByText("New feature: Task Review")).toBeHidden();
        await expect(
          page.getByTestId("announcement-tooltip-trigger"),
        ).toBeHidden();
      });
    });
  });
});
