import { test, expect } from "../../fixtures";

test.describe("Test Analysis", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/version/5e4ff3abe3c3317e352062e4/test-analysis");
  });

  test("should group together all matching failing tests in a version and present a stat", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page.getByText("1 test failed across more than one task"),
    ).toBeVisible();
    await expect(page.getByText("JustAFakeTestInALonelyWorld")).toBeVisible();
    await expect(
      page.getByText("JustAnotherFakeFailingTestInALonelyWorld"),
    ).toBeVisible();
  });

  test("clicking on a test should show the test details", async ({
    authenticatedPage: page,
  }) => {
    await page.getByText("JustAFakeTestInALonelyWorld").click();
    await expect(
      page.getByTestId("failed-test-grouped-table").first(),
    ).toBeVisible();
  });

  test("filtering by test name should only show matching tests", async ({
    authenticatedPage: page,
  }) => {
    await page
      .getByLabel("Search Test Failures")
      .fill("JustAFakeTestInALonelyWorld");
    await page.getByLabel("Search Test Failures").press("Enter");
    await expect(
      page.getByText("1 test failed across more than one task"),
    ).toBeVisible();
    await expect(page.getByText("JustAFakeTestInALonelyWorld")).toBeVisible();
    await expect(
      page.getByText("JustAnotherFakeFailingTestInALonelyWorld"),
    ).toBeHidden();
  });

  test("filtering by task status should only show matching tests", async ({
    authenticatedPage: page,
  }) => {
    await page.getByLabel("Failure Type").click();
    await expect(
      page.getByTestId("task-status-known-issue-option"),
    ).toBeVisible();
    await page.getByTestId("task-status-known-issue-option").click();

    await expect(
      page.getByText("0 tests failed across more than one task"),
    ).toBeVisible();
    await expect(page.getByText("JustAFakeTestInALonelyWorld")).toBeVisible();
    await expect(
      page.getByText("JustAnotherFakeFailingTestInALonelyWorld"),
    ).toBeHidden();
  });

  test("clearing the filters should reset the view", async ({
    authenticatedPage: page,
  }) => {
    await page
      .getByLabel("Search Test Failures")
      .fill("JustAFakeTestInALonelyWorld");
    await page.getByLabel("Search Test Failures").press("Enter");
    await page.getByLabel("Failure Type").click();
    await expect(
      page.getByTestId("task-status-known-issue-option"),
    ).toBeVisible();
    await page.getByTestId("task-status-known-issue-option").click();
    await page.keyboard.press("Escape");

    await expect(
      page.getByText("0 tests failed across more than one task"),
    ).toBeVisible();
    await expect(page.getByTestId("clear-filter-button")).not.toHaveAttribute(
      "disabled",
    );
    await page.getByTestId("clear-filter-button").click();
    await expect(page.getByLabel("Search Test Failures")).toHaveValue("");
    await expect(
      page.getByText("1 test failed across more than one task"),
    ).toBeVisible();
  });
});
