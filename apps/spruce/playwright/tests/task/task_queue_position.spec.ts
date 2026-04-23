import { test, expect } from "../../fixtures";

test.describe("Task Queue Position", () => {
  const taskOnQueue =
    "/task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
  const taskNotOnQueue =
    "/task/evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_5ecedafb562343215a7ff297_20_05_27_21_39_46";

  test("Shows link to task queue if task is on queue", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(taskOnQueue);
    await expect(page.getByTestId("task-queue-position")).toHaveAttribute(
      "href",
      "/task-queue/archlinux-test?taskId=evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    );
  });

  test("Does not show link to task queue if task is not on queue", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(taskNotOnQueue);
    await expect(page.getByTestId("task-queue-position")).toBeHidden();
  });
});
