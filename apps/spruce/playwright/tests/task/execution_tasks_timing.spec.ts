import { test, expect } from "../../fixtures";

test.describe("Execution Tasks Timing", () => {
  const taskRoute =
    "/task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47";
  const executionTasksTimingRoute = `${taskRoute}/execution-tasks-timing`;

  test.describe("Tab Navigation", () => {
    test("Should be able to navigate to the Execution Tasks Timing tab", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(taskRoute);
      await page.getByTestId("execution-tasks-timing-tab").click();
      await expect(page).toHaveURL(
        `${executionTasksTimingRoute}?execution=0&sorts=STATUS%3AASC`,
      );
    });
  });

  test.describe("Chart Rendering", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(executionTasksTimingRoute);
    });

    test("Should render the Gantt chart container", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.locator("[id^=reactgooglegraph]")).toBeVisible();
    });

    test("Should display task name in the description", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByText(
          "This page shows a timeline view of execution task run times for asdf",
        ),
      ).toBeVisible();
    });

    test("Should render chart with execution tasks", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.locator("[id^=reactgooglegraph]")).toBeVisible();

      // Check that specific task names are rendered in the chart
      const expectedTasks = ["test-command", "test-db", "test-util"];

      const svgTexts = page.locator("svg > g > text");
      const textContent = await svgTexts.allTextContents();

      // Verify each expected task is present
      for (const task of expectedTasks) {
        expect(textContent.join(" ")).toContain(task);
      }
    });
  });

  test.describe("Tab Visibility", () => {
    test("Should not show the Execution Tasks Timing tab for non-display tasks", async ({
      authenticatedPage: page,
    }) => {
      // Visit a regular task (not a display task)
      const regularTaskRoute =
        "/task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
      await page.goto(regularTaskRoute);

      // The execution tasks timing tab should not be visible
      await expect(page.getByTestId("execution-tasks-timing-tab")).toBeHidden();
    });
  });

  test.describe("Interaction", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(executionTasksTimingRoute);
    });

    test("Should allow clicking on tasks to navigate", async ({
      authenticatedPage: page,
    }) => {
      // Wait for chart to load
      await expect(page.locator("[id^=reactgooglegraph]")).toBeVisible();

      // Google Charts makes tasks clickable within the chart
      const chart = page.locator("[id^=reactgooglegraph]");
      await chart.getByText("test-command").click();

      // Should navigate to the test-command task page
      await expect(page).toHaveURL(
        "http://localhost:3000/task/mci_ubuntu1604_test_command_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/logs?execution=0",
      );
    });
  });
});
