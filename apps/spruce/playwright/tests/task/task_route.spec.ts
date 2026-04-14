import { test, expect } from "../../fixtures";

const tasks = {
  1: "evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
  2: "evergreen_ubuntu1604_89",
  3: "patch-2-evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_6ecedafb562343215a7ff297_20_05_27_21_39_46",
};

const taskStates = {
  failedTaskWithFailedTests:
    "evergreen_ubuntu1604_test_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
  runningTask: "task_annotation_test",
  succeededTask:
    "evergreen_ubuntu1604_js_test_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
  failedTaskWithNoFailedTests:
    "spruce_ubuntu1604_check_codegen_69c03101ab23f54924309125432862cd4059420f_22_02_24_18_42_11",
};

test.describe("Task Page Route", () => {
  test("shouldn't get stuck in a redirect loop when visiting the task page and trying to navigate to a previous page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/user/admin/patches");
    await page.goto(`/task/${tasks[1]}`);
    await page.goBack();
    expect(page.url()).toContain("/user/admin/patches");
  });

  test("should not be redirected if they land on a task page with a tab supplied", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`/task/${tasks[1]}/files`);
    expect(page.url()).toContain(`/task/${tasks[1]}/files`);
  });

  test("should display an appropriate status badge when visiting task pages", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`/task/${tasks[1]}`);
    await expect(
      page.getByTestId("task-status-badge").getByText("Dispatched"),
    ).toBeVisible();
    await page.goto(`/task/${tasks[2]}`);
    await expect(
      page.getByTestId("task-status-badge").getByText("Running").first(),
    ).toBeVisible();
    await page.goto(`/task/${tasks[3]}`);
    await expect(
      page.getByTestId("task-status-badge").getByText("Succeeded").first(),
    ).toBeVisible();
  });

  test.describe("should redirect to the appropriate task tab depending on the conditions", () => {
    test("should redirect to the logs tab if the task is running", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`/task/${taskStates.runningTask}`);
      await expect(page).toHaveURL(
        `/task/${taskStates.runningTask}/logs?execution=2`,
      );
    });

    test("should redirect to the logs tab if the task is in a completed state", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`/task/${taskStates.succeededTask}`);
      await expect(page).toHaveURL(
        `/task/${taskStates.succeededTask}/logs?execution=0`,
      );
    });

    test("should redirect to the tests tab if the task is completed and has failed tests", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`/task/${taskStates.failedTaskWithFailedTests}`);
      await expect(page).toHaveURL(
        `/task/${taskStates.failedTaskWithFailedTests}/tests?execution=0&sorts=STATUS%3AASC`,
      );
    });

    test("should redirect to the logs tab if the task is completed as failed and has no failed tests", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`/task/${taskStates.failedTaskWithNoFailedTests}`);
      await expect(page).toHaveURL(
        `/task/${taskStates.failedTaskWithNoFailedTests}/logs?execution=0`,
      );
    });
  });
});
