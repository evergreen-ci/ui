import { Page } from "@playwright/test";
import { test, expect } from "../../fixtures";
import { clickCheckboxByLabel } from "../../helpers";

const patch = { id: "5e4ff3abe3c3317e352062e4" };
const pathTasks = `/version/${patch.id}/tasks`;
const pathURLWithFilters = `${pathTasks}?page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&statuses=failed,success,running-umbrella,dispatched,started&taskName=test-thirdparty&variant=ubuntu`;
const defaultPath = `${pathTasks}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`;

const waitForTaskTable = async (page: Page) => {
  const table = page.getByTestId("tasks-table");
  await expect(table).toBeVisible();
  await expect(table).not.toHaveAttribute("data-loading", "true");
};

test.describe("Tasks filters", () => {
  test("Should clear any filters with the Clear All Filters button and reset the table to its default state", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(pathURLWithFilters);
    await waitForTaskTable(page);
    await expect(page.getByTestId("tasks-table-row").first()).toBeVisible();

    await page.getByTestId("clear-all-filters").click();
    await expect(page).toHaveURL(`${defaultPath}`);

    await page.getByTestId("task-name-filter").click();
    await expect(
      page.getByTestId("task-name-filter-wrapper").locator("input"),
    ).toHaveValue("");

    await page.getByTestId("status-filter").click();
    const statusCheckboxes = page
      .getByTestId("status-filter-wrapper")
      .locator('input[type="checkbox"]');

    for (const checkbox of await statusCheckboxes.all()) {
      await expect(checkbox).not.toBeChecked();
    }

    await page.getByTestId("base-status-filter").click();
    const baseStatusCheckboxes = page
      .getByTestId("base-status-filter-wrapper")
      .locator('input[type="checkbox"]');

    for (const checkbox of await baseStatusCheckboxes.all()) {
      await expect(checkbox).not.toBeChecked();
    }

    await page.getByTestId("variant-filter").click();
    await expect(
      page.getByTestId("variant-filter-wrapper").locator("input"),
    ).toHaveValue("");
  });

  test.describe("Variant input field", () => {
    const variantInputValue = "lint";

    test("Updates url with input value and fetches tasks filtered by variant", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(defaultPath);
      await waitForTaskTable(page);
      await page.getByTestId("variant-filter").click();

      const variantInput = page
        .getByTestId("variant-filter-wrapper")
        .locator("input");
      await variantInput.focus();
      await variantInput.fill(variantInputValue);
      await variantInput.press("Enter");
      await expect(page.getByTestId("variant-filter-wrapper")).toHaveCount(0);
      await expect(page).toHaveURL(new RegExp(variantInputValue));
      await waitForTaskTable(page);
      await expect(page.getByTestId("filtered-count")).toContainText("2");

      await page.getByTestId("variant-filter").click();
      await variantInput.focus();
      await variantInput.clear();
      await variantInput.press("Enter");
      await expect(page.getByTestId("variant-filter-wrapper")).toHaveCount(0);
      await expect(page).not.toHaveURL(/variant=/);
      await waitForTaskTable(page);
      await expect(page.getByTestId("filtered-count")).toContainText("47");
    });
  });

  test.describe("Task name input field", () => {
    const taskNameInputValue = "test-cloud";

    test("Updates url with input value and fetches tasks filtered by task name", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(defaultPath);
      await waitForTaskTable(page);
      await page.getByTestId("task-name-filter").click();

      const taskNameInput = page
        .getByTestId("task-name-filter-wrapper")
        .locator("input");
      await taskNameInput.focus();
      await taskNameInput.fill(taskNameInputValue);
      await taskNameInput.press("Enter");
      await expect(page.getByTestId("task-name-filter-wrapper")).toHaveCount(0);
      await expect(page).toHaveURL(new RegExp(taskNameInputValue));
      await waitForTaskTable(page);
      await expect(page.getByTestId("filtered-count")).toContainText("1");

      await page.getByTestId("task-name-filter").click();
      await taskNameInput.focus();
      await taskNameInput.clear();
      await taskNameInput.press("Enter");
      await expect(page.getByTestId("task-name-filter-wrapper")).toHaveCount(0);
      await expect(page).not.toHaveURL(/taskName=/);
      await waitForTaskTable(page);
      await expect(page.getByTestId("filtered-count")).toContainText("47");
    });
  });

  test.describe("Task Statuses select", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(defaultPath);
      await waitForTaskTable(page);
      await page.getByTestId("status-filter").click();
      await expect(page.getByTestId("tree-select-options")).toBeVisible();
    });

    test("Clicking on a status filter filters the tasks to only those statuses", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId("tree-select-options")
        .getByText("Failed")
        .first()
        .click();
      await expect(page).toHaveURL(/statuses=failed/);
      await waitForTaskTable(page);
      await expect(page.getByTestId("filtered-count")).toHaveText("2");

      await page
        .getByTestId("tree-select-options")
        .getByText("Succeeded")
        .click();
      await expect(page).toHaveURL(
        /statuses=failed-umbrella,failed,known-issue,success/,
      );
      await waitForTaskTable(page);
      await expect(page.getByTestId("filtered-count")).not.toHaveText("2");
    });

    test("Clicking on 'All' checkbox adds all the statuses and clicking again removes them", async ({
      authenticatedPage: page,
    }) => {
      const taskStatuses = [
        "All",
        "Failed",
        "Known Issue",
        "Succeeded",
        "Running",
        "Dispatched",
        "Blocked",
      ];
      await clickCheckboxByLabel(page, "All");
      for (const label of taskStatuses) {
        const checkbox = page.getByRole("checkbox", { name: label }).first();
        await expect(checkbox).toBeChecked();
      }
      await expect(page).toHaveURL(/statuses=all/);
      await waitForTaskTable(page);

      await clickCheckboxByLabel(page, "All");
      for (const label of taskStatuses) {
        const checkbox = page.getByRole("checkbox", { name: label }).first();
        await expect(checkbox).not.toBeChecked();
      }
      await expect(page).not.toHaveURL(/statuses/);
    });
  });

  test.describe("Task Base Statuses select", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(defaultPath);
      await waitForTaskTable(page);
      await page.getByTestId("base-status-filter").click();
      await expect(
        page.getByTestId("base-status-filter-wrapper"),
      ).toBeVisible();
    });

    test("Clicking on a base status filter filters the tasks to only those base statuses", async ({
      authenticatedPage: page,
    }) => {
      await clickCheckboxByLabel(page, "Succeeded");
      await expect(page).toHaveURL(/baseStatuses=success/);
      await waitForTaskTable(page);
      await expect(page.getByTestId("filtered-count")).toHaveText("44");

      await clickCheckboxByLabel(page, "Succeeded");
      await expect(page).not.toHaveURL(/baseStatuses/);
      await waitForTaskTable(page);
      await expect(page.getByTestId("filtered-count")).toHaveText("47");
    });

    test("Clicking on 'All' checkbox adds all the base statuses and clicking again removes them", async ({
      authenticatedPage: page,
    }) => {
      const taskStatuses = ["All", "Succeeded", "Running"];
      await clickCheckboxByLabel(page, "All");
      for (const label of taskStatuses) {
        await expect(page.getByRole("checkbox", { name: label })).toBeChecked();
      }
      await expect(page).toHaveURL(/baseStatuses=all/);
      await waitForTaskTable(page);

      await clickCheckboxByLabel(page, "All");
      for (const label of taskStatuses) {
        await expect(
          page.getByRole("checkbox", { name: label }),
        ).not.toBeChecked();
      }
      await expect(page).not.toHaveURL(/baseStatuses/);
    });
  });
});
