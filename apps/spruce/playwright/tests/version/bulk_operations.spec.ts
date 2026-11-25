import { Page, expect, test } from "../../fixtures";
import { clickCheckbox, validateToast } from "../../helpers";

const versionTasksPath =
  "/version/spruce_e695f654c8b4b959d3e12e71696c3e318bcd4c33/tasks";

const waitForTaskTable = async (page: Page) => {
  const table = page.getByTestId("tasks-table");
  await expect(table).toBeVisible();
  await expect(table).toHaveAttribute("data-loading", "false");
};

test.describe("Bulk operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(versionTasksPath);
    await waitForTaskTable(page);
  });

  test.describe("Modify tasks button", () => {
    test("Modify tasks button is disabled with no count when no tasks are selected", async ({
      page,
    }) => {
      const modifyTasks = page.getByRole("button", { name: "Modify tasks" });
      await expect(modifyTasks).toBeVisible();
      await expect(modifyTasks).toBeDisabled();
      await expect(modifyTasks).toHaveText("Modify tasks");
    });

    test("Modify tasks button shows the number of selected tasks", async ({
      page,
    }) => {
      const modifyTasks = page.getByRole("button", { name: "Modify tasks" });
      const rowCheckboxes = page.getByTestId("select-row");

      await clickCheckbox(rowCheckboxes.nth(0));
      await expect(modifyTasks).toBeEnabled();
      await expect(modifyTasks).toHaveText("Modify tasks (1)");

      await clickCheckbox(rowCheckboxes.nth(1));
      await expect(modifyTasks).toHaveText("Modify tasks (2)");

      await clickCheckbox(rowCheckboxes.nth(1));
      await clickCheckbox(rowCheckboxes.nth(0));
      await expect(modifyTasks).toBeDisabled();
      await expect(modifyTasks).toHaveText("Modify tasks");
    });

    test("Select all counts every task matching the filter", async ({
      page,
    }) => {
      const modifyTasks = page.getByRole("button", { name: "Modify tasks" });

      const selectAll = page.getByTestId("select-all-rows");

      await clickCheckbox(selectAll);
      await expect(modifyTasks).toBeEnabled();
      await expect(modifyTasks).not.toHaveText("Modify tasks");
      await expect(modifyTasks).toHaveText("Modify tasks (8)");

      await clickCheckbox(selectAll);
      await expect(modifyTasks).toBeDisabled();
    });
  });

  test.describe("scheduling", () => {
    test("Scheduling selected tasks shows a toast and clears the selection", async ({
      page,
    }) => {
      const modifyTasks = page.getByRole("button", { name: "Modify tasks" });

      await clickCheckbox(
        page.getByRole("checkbox", { name: "Select task check_codegen" }),
      );
      await expect(modifyTasks).toHaveText("Modify tasks (1)");

      await modifyTasks.click();
      await page.getByTestId("schedule-selected-tasks").click();

      await validateToast(page, "success", "Scheduled 1 task");
      await expect(modifyTasks).toBeDisabled();
      await expect(modifyTasks).toHaveText("Modify tasks");
    });
  });
});
