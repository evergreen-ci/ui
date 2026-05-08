import { test, expect } from "../../fixtures";

const tasks = {
  withTests:
    "evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
  noFailedTests:
    "evergreen_ubuntu1604_test_auth_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
  noTests:
    "evergreen_ubuntu1604_test_operations_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
  displayTask: "evergreen_ubuntu1604_89",
};

const taskRoute = (id: string) => `/task/${id}`;

const task = {
  logs: {
    route: `${taskRoute(tasks.withTests)}/logs`,
    btn: "task-logs-tab",
  },
  tests: {
    route: `${taskRoute(tasks.withTests)}/tests`,
    btn: "task-tests-tab",
  },
  files: {
    route: `${taskRoute(tasks.withTests)}/files`,
    btn: "task-files-tab",
  },
  display: {
    route: `${taskRoute(tasks.displayTask)}/execution-tasks`,
    btn: "task-execution-tab",
  },
};

test.describe("page tabs", () => {
  test("selects tests tab by default if there are tests and no tab is provided in url", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(taskRoute(tasks.withTests));
    await expect(page.getByTestId(task.tests.btn)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("selects logs tab by default if there are no tests and no tab is provided in url", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(taskRoute(tasks.noTests));
    await expect(page.getByTestId(task.logs.btn)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("toggling between tabs updates the url with the selected tab name", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(taskRoute(tasks.withTests));
    await expect(page).toHaveURL(
      `${task.tests.route}?execution=0&sorts=STATUS%3AASC`,
    );
    await page.getByTestId(task.logs.btn).click();
    await expect(page).toHaveURL(
      `${task.logs.route}?execution=0&sorts=STATUS%3AASC`,
    );
    await page.getByTestId(task.files.btn).click();
    await expect(page).toHaveURL(
      `${task.files.route}?execution=0&sorts=STATUS%3AASC`,
    );
  });

  test("replaces invalid tab names in url path with a default route", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${taskRoute(tasks.withTests)}/chicken`);
    await expect(page).toHaveURL(
      `${task.tests.route}?execution=0&sorts=STATUS%3AASC`,
    );
  });

  test("Should only display a badge with the number of failed tests if they exist", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(taskRoute(tasks.withTests));
    await expect(page.getByTestId("tests-tab-badge")).toContainText("1");
    await page.goto(taskRoute(tasks.noFailedTests));
    await expect(page.getByTestId("tests-tab-badge")).toBeHidden();
  });

  test("Should display a badge with the number of files in the Files tab", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(task.files.route);
    await expect(page.getByTestId("files-tab-badge")).toContainText("0");
  });

  test("Should default to the execution task tab if the task is a display task", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(taskRoute(tasks.displayTask));
    await expect(page.getByTestId(task.display.btn)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
