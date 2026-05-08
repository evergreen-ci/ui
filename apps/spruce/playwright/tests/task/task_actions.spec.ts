import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

const prioritySuccessBannerText = "Priority updated for 1 task.";
const restartSuccessBannerText = "Task scheduled to restart";
const unscheduleSuccessBannerText = "Task marked as unscheduled";
const tasks = {
  1: "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
  2: "/task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
  3: "/task/evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_5ecedafb562343215a7ff297_20_05_27_21_39_46",
  4: "/task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/execution-tasks?execution=0",
  5: "/task/evergreen_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
};

test.describe("Task Action Buttons", () => {
  test.describe("Based on the state of the task, some buttons should be disabled and others should be clickable. Clicking on buttons produces banners messaging if the action succeeded or failed.", () => {
    test("Schedule button should be disabled on a completed task", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(tasks[1]);
      await expect(page.getByTestId("schedule-task")).toBeDisabled();
    });

    test("Clicking Restart button should restart a task and display a success toast", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(tasks[3]);
      await page.getByTestId("restart-task").click();
      await validateToast(page, "success", restartSuccessBannerText);
    });

    test("Clicking Unschedule button should unschedule a task and display a success toast", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(tasks[5]);
      await page.getByTestId("ellipsis-btn").click();
      await expect(page.getByTestId("card-dropdown")).toBeVisible();
      await page.getByTestId("unschedule-task").click();
      await validateToast(page, "success", unscheduleSuccessBannerText);
    });

    test("Abort button should be disabled on completed tasks", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(tasks[3]);
      await page.getByTestId("ellipsis-btn").click();
      await expect(page.getByTestId("card-dropdown")).toBeVisible();
      await expect(page.getByTestId("abort-task")).toBeDisabled();
    });

    test("Clicking on set priority, entering a priority value and submitting should result in a success toast", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(tasks[5]);
      await page.getByTestId("ellipsis-btn").click();
      await expect(page.getByTestId("card-dropdown")).toBeVisible();
      await page.getByTestId("set-priority-menu-item").click();
      await page.getByTestId("task-priority-input").fill("99");
      await page.getByTestId("task-priority-input").press("Enter");
      await validateToast(page, "success", prioritySuccessBannerText);
    });

    test("Should be able to abort an incomplete task", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(tasks[2]);
      await page.getByTestId("ellipsis-btn").click();
      await expect(page.getByTestId("card-dropdown")).toBeVisible();
      await page.getByTestId("abort-task").click();
      await validateToast(page, "success", "Task aborted");
    });

    test("Should correctly disable/enable the task when clicked", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(tasks[5]);
      await page.getByTestId("ellipsis-btn").click();
      await expect(page.getByTestId("card-dropdown")).toBeVisible();
      await page.getByTestId("disable-enable").click();
      await validateToast(page, "success", "Task successfully disabled", true);

      await page.getByTestId("ellipsis-btn").click();
      await expect(page.getByTestId("card-dropdown")).toBeVisible();
      await page.getByTestId("disable-enable").click();
      await validateToast(page, "success", prioritySuccessBannerText);
    });
  });

  test.describe("restarting a display task", () => {
    test("does not allow restarting only failed execution tasks when all execution tasks were successful", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(tasks[4]);
      await page.getByTestId("restart-task").click();
      await validateToast(page, "success", restartSuccessBannerText);
    });
  });
});
