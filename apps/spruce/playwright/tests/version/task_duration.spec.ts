import { test, expect } from "../../fixtures";

test.describe("Task Duration Tab", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/version/5e4ff3abe3c3317e352062e4/task-duration");
  });

  test.describe("when interacting with the filters on the page", () => {
    test("updates URL appropriately when task name filter is applied", async ({
      authenticatedPage: page,
    }) => {
      const filterText = "test-annotation";
      await page.getByTestId("task-name-filter-popover").click();
      const filterInput = page.getByPlaceholder("Task name regex");
      await filterInput.fill(filterText);
      await filterInput.press("Enter");
      await expect(page.getByTestId("task-duration-table-row")).toHaveCount(1);
      await expect(page).toHaveURL(
        /page=0&sorts=DURATION%3ADESC&taskName=test-annotation/,
      );

      await page.getByTestId("task-name-filter-popover").click();
      await filterInput.clear();
      await filterInput.press("Enter");
      await expect(page).toHaveURL(
        "/version/5e4ff3abe3c3317e352062e4/task-duration?page=0&sorts=DURATION%3ADESC",
      );
    });

    test("updates URL appropriately when status filter is applied", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("status-filter-popover").click();
      const options = page.getByTestId("tree-select-options");
      await expect(options).toBeVisible();
      await options.getByText("Running").first().click();
      await expect(page.getByTestId("task-duration-table-row")).toHaveCount(3);
      await expect(page).toHaveURL(
        /statuses=running-umbrella,started,dispatched/,
      );
      await expect(options).toBeVisible();
      await options.getByText("Succeeded").click();
      await expect(page).toHaveURL(
        /statuses=running-umbrella,started,dispatched,success/,
      );
    });

    test("updates URL appropriately when build variant filter is applied", async ({
      authenticatedPage: page,
    }) => {
      const filterText = "Lint";
      await page.getByTestId("build-variant-filter-popover").click();
      const filterInput = page.getByPlaceholder("Build variant regex");
      await filterInput.fill(filterText);
      await filterInput.press("Enter");
      await expect(page.getByTestId("task-duration-table-row")).toHaveCount(2);
      await expect(page).toHaveURL(/page=0&sorts=DURATION%3ADESC&variant=Lint/);

      await page.getByTestId("build-variant-filter-popover").click();
      await filterInput.clear();
      await filterInput.press("Enter");
      await expect(page).toHaveURL(
        "/version/5e4ff3abe3c3317e352062e4/task-duration?page=0&sorts=DURATION%3ADESC",
      );
    });

    test("updates URL appropriately when sort is changing", async ({
      authenticatedPage: page,
    }) => {
      const durationSortControl = page.getByRole("button", {
        name: "Sort by Task Duration",
      });
      const statusSortControl = page.getByRole("button", {
        name: "Sort by Status",
      });
      const variantSortControl = page.getByRole("button", {
        name: "Sort by Build Variant",
      });

      await expect(page).toHaveURL(
        "/version/5e4ff3abe3c3317e352062e4/task-duration?sorts=DURATION%3ADESC",
      );
      const longestTask = "test-thirdparty";
      await expect(page.getByText(longestTask)).toBeVisible();
      await expect(
        page.getByTestId("task-duration-table-row").first(),
      ).toContainText(longestTask);

      await durationSortControl.click();
      await expect(page).toHaveURL(
        "/version/5e4ff3abe3c3317e352062e4/task-duration?page=0",
      );
      await durationSortControl.click();
      await expect(page).toHaveURL(/sorts=DURATION%3AASC/);
      const shortestTask = "clone_test-model";
      await expect(page.getByText(shortestTask)).toBeVisible();
      await expect(
        page.getByTestId("task-duration-table-row").first(),
      ).toContainText(shortestTask);

      await statusSortControl.click();
      await expect(page).toHaveURL(
        /page=0&sorts=DURATION%3AASC%3BSTATUS%3AASC/,
      );
      await statusSortControl.click();
      await expect(page).toHaveURL(
        /page=0&sorts=DURATION%3AASC%3BSTATUS%3ADESC/,
      );
      await variantSortControl.click();
      await expect(page).toHaveURL(
        /page=0&sorts=DURATION%3AASC%3BSTATUS%3ADESC/,
      );
    });

    test("clearing all filters resets to the default sort", async ({
      authenticatedPage: page,
    }) => {
      const durationSortControl = page.getByRole("button", {
        name: "Sort by Task Duration",
      });
      await durationSortControl.click();
      await expect(page).toHaveURL(
        "/version/5e4ff3abe3c3317e352062e4/task-duration?page=0",
      );
      await durationSortControl.click();
      await expect(page).toHaveURL(/sorts=DURATION%3AASC/);
      await page.getByText("Clear all filters").click();
      await expect(page).toHaveURL(/sorts=DURATION%3ADESC/);
    });

    test("shows message when no test results are found", async ({
      authenticatedPage: page,
    }) => {
      const filterText = "this_does_not_exist";
      await page.getByTestId("task-name-filter-popover").click();
      const filterInput = page.getByPlaceholder("Task name regex");
      await filterInput.fill(filterText);
      await filterInput.press("Enter");
      await expect(
        page.getByTestId("task-name-filter-popover-task-duration-table-row"),
      ).toHaveCount(0);
      await expect(page.getByText("No tasks found.")).toBeVisible();
    });
  });
});
