import { test, expect } from "../../fixtures";

const chart = "[id^=reactgooglegraph]";

test.describe("Version Timing Tab without a variant selected", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/version/5e4ff3abe3c3317e352062e4/version-timing");
  });

  test("shows a chart of all variants in the version", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.locator(chart).getByText("Ubuntu 16.04")).toBeVisible();
    await expect(page.locator(chart).getByText("Race Detector")).toBeVisible();
    await expect(page.locator(chart).getByText("Lint")).toBeVisible();
  });

  test("allows the user to select a variant and navigate to the variant timing view", async ({
    authenticatedPage: page,
  }) => {
    await page.locator(chart).getByText("Ubuntu 16.04").click();
    await expect(page).toHaveURL(
      "/version/5e4ff3abe3c3317e352062e4/version-timing?variant=%5Eubuntu1604%24",
    );
  });

  test("has disabled pagination functionality", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page.locator("button[aria-labelledby='page-size-select']"),
    ).toHaveAttribute("aria-disabled", "true");
    await expect(page.getByTestId("next-page-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(page.getByTestId("prev-page-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(page.getByTestId("clear-all-filters")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

test.describe("Version Timing Tab with a variant selected", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(
      "/version/5e4ff3abe3c3317e352062e4/version-timing?variant=^ubuntu1604%24",
    );
  });

  const expectedTasks = [
    [
      "test-agent",
      "test-cloud",
      "test-operations",
      "test-scheduler",
      "js-test",
      "test-units",
      "test-command",
      "test-model",
      "test-model-2",
      "test-model-host",
    ],
    [
      "test-validator",
      "test-thirdparty",
      "test-service",
      "test-rest-model",
      "test-rest-client",
      "test-graphql",
      "test-repotracker",
      "test-trigger",
      "test-rest-data",
      "test-rest-route",
    ],
    [
      "test-model-grid",
      "test-model-user",
      "test-model-testresult",
      "test-model-manifest",
      "test-model-notification",
      "test-model-commitqueue",
      "test-model-patch",
      "test-model-event",
      "test-monitor",
      "test-model-task",
    ],
    [
      "test-migrations",
      "test-model-alertrecord",
      "test-thirdparty-docker",
      "test-model-stats",
      "test-evergreen",
      "test-model-distro",
      "test-util",
      "test-model-artifact",
      "test-model-build",
      "test-plugin",
    ],
    ["test-db", "test-auth"],
  ];

  test("shows a paginated chart of all tasks in the variant", async ({
    authenticatedPage: page,
  }) => {
    for (const pageTasks of expectedTasks.slice(0, -1)) {
      for (const task of pageTasks) {
        await expect(
          page.locator(chart).getByText(task, { exact: true }),
        ).toBeVisible();
      }
      await page.getByTestId("next-page-button").click();
    }
    for (const task of expectedTasks.at(-1)!) {
      await expect(
        page.locator(chart).getByText(task, { exact: true }),
      ).toBeVisible();
    }

    const reversedTasks = [...expectedTasks].reverse();
    for (const pageTasks of reversedTasks.slice(0, -1)) {
      for (const task of pageTasks) {
        await expect(
          page.locator(chart).getByText(task, { exact: true }),
        ).toBeVisible();
      }
      await page.getByTestId("prev-page-button").click();
    }
    for (const task of reversedTasks.at(-1)!) {
      await expect(
        page.locator(chart).getByText(task, { exact: true }),
      ).toBeVisible();
    }
  });

  test("respects the task filter", async ({ authenticatedPage: page }) => {
    await page.goto(
      "/version/5e4ff3abe3c3317e352062e4/version-timing?taskName=agent&variant=^ubuntu1604%24",
    );
    await expect(page.getByTestId("next-page-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(
      page.locator(chart).getByText("test-agent", { exact: true }),
    ).toBeVisible();
    const otherTasks = expectedTasks.flat().filter((t) => t !== "test-agent");
    for (const task of otherTasks) {
      await expect(
        page.locator(chart).getByText(task, { exact: true }),
      ).toBeHidden();
    }
  });

  test("allows the user to clear all filters", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("clear-all-filters").click();
    await expect(page).toHaveURL(
      "/version/5e4ff3abe3c3317e352062e4/version-timing?sorts=DURATION%3ADESC",
    );
    await expect(page.locator(chart).getByText("Ubuntu 16.04")).toBeVisible();
    await expect(page.locator(chart).getByText("Race Detector")).toBeVisible();
    await expect(page.locator(chart).getByText("Lint")).toBeVisible();
  });

  test("allows the user to change the page size", async ({
    authenticatedPage: page,
  }) => {
    await page.locator("button[aria-labelledby='page-size-select']").click();
    await page.getByText("50 / page").first().click();
    await expect(page).toHaveURL(/limit=50/);
    for (const task of expectedTasks.flat()) {
      await expect(
        page.locator(chart).getByText(task, { exact: true }),
      ).toBeVisible();
    }
  });

  test("allows the user to select a task and navigate to it", async ({
    authenticatedPage: page,
  }) => {
    await page.locator(chart).getByText("test-agent").click();
    await expect(page).toHaveURL(
      "/task/evergreen_ubuntu1604_test_agent_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs?execution=0",
    );
  });
});
