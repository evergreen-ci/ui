import { test, expect } from "../../fixtures";

test.describe("Selecting Task Execution", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(
      "/task/logkeeper_ubuntu_test_edd78c1d581bf757a880777b00685321685a8e67_16_10_20_21_58_58/logs",
    );
    // Wait for page to finish loading.
    await expect(page.getByText("No logs found")).toBeVisible();
  });

  test("Should take user to the latest execution if no execution is specified", async ({
    authenticatedPage: page,
  }) => {
    expect(page.url()).toContain("execution=1");
    await expect(
      page.getByTestId("execution-select").getByText("Execution 2 (latest)"),
    ).toBeVisible();
    await expect(
      page.getByTestId("task-status-badge").getByText("Will Run"),
    ).toBeVisible();
  });

  test("Toggling a different execution should change the displayed execution", async ({
    authenticatedPage: page,
  }) => {
    expect(page.url()).toContain("execution=1");
    await expect(
      page.getByTestId("execution-select").getByText("Execution 2 (latest)"),
    ).toBeVisible();
    await expect(page.getByTestId("execution-select")).toBeEnabled();
    await page.getByTestId("execution-select").click();
    await page.getByTestId("execution-0").click();
    await expect(
      page.getByTestId("task-status-badge").getByText("Succeeded"),
    ).toBeVisible();
    expect(page.url()).toContain("execution=0");
  });
});
