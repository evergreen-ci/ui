import { test, expect } from "../../fixtures";

const knownIssueTask = 'a[data-tooltip="test-cloud - Known Issue"]';
const knownIssueTaskId =
  "evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";

test.describe("task overview popup", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/project/evergreen/waterfall");
  });

  test("displays task overview popup on alt+click", async ({
    authenticatedPage: page,
  }) => {
    await page.locator(knownIssueTask).click({ modifiers: ["Alt"] });
    const popup = page.getByTestId("task-overview-popup");
    await expect(popup).toBeVisible();

    await expect(page.getByTestId("task-distro-link")).toContainText(
      "ubuntu1604-small",
    );
    await expect(popup).toContainText("Failing Command");
    await expect(popup).toContainText("host.list");
  });

  test("closes the popup when clicking outside", async ({
    authenticatedPage: page,
  }) => {
    const taskElement = page.locator(knownIssueTask);
    await taskElement.click({ modifiers: ["Alt"] });
    await expect(page.getByTestId("task-overview-popup")).toBeVisible();
    await taskElement.click({ modifiers: ["Alt"] });
    await expect(page.getByTestId("task-overview-popup")).toBeHidden();
    await taskElement.click({ modifiers: ["Alt"] });
    await expect(page.getByTestId("task-overview-popup")).toBeVisible();
  });

  test("navigates to task page when clicking the task link", async ({
    authenticatedPage: page,
  }) => {
    await page.locator(knownIssueTask).click({ modifiers: ["Alt"] });
    const popup = page.getByTestId("task-overview-popup");
    await expect(popup).toBeVisible();
    await page.getByTestId("task-link").click();
    await expect(page).toHaveURL(new RegExp(`/task/${knownIssueTaskId}`));
  });

  test("displays associated issues", async ({ authenticatedPage: page }) => {
    await page.locator(knownIssueTask).click({ modifiers: ["Alt"] });
    const popup = page.getByTestId("task-overview-popup");
    await expect(popup).toBeVisible();
    await expect(popup).toContainText("Associated Issues");
    await expect(popup).toContainText("Some-Text");
    await expect(popup).toContainText("AnotherOne");
    await expect(popup).toContainText("More-Text");
    await expect(popup).toContainText("A-Random-Ticket");
  });

  test("displays failing tests for a failed task", async ({
    authenticatedPage: page,
  }) => {
    const testServiceTask = 'a[data-tooltip="test-service - Failed"]';
    await page.locator(testServiceTask).click({ modifiers: ["Alt"] });
    const popup = page.getByTestId("task-overview-popup");
    await expect(popup).toBeVisible();
    await expect(popup).toContainText("Failing Test(s)");
    await expect(popup).toContainText("JustAFakeTestInALonelyWorld");
    await expect(popup).toContainText(
      "JustAnotherFakeFailingTestInALonelyWorld",
    );
  });

  test.describe("buttons", () => {
    test("restart button restarts the task", async ({
      authenticatedPage: page,
    }) => {
      await page.locator(knownIssueTask).click({ modifiers: ["Alt"] });
      const popup = page.getByTestId("task-overview-popup");
      await expect(popup).toBeVisible();

      const restartButton = page.getByRole("button", { name: "Restart" });
      await expect(restartButton).toBeVisible();
      await restartButton.click();

      await expect(popup).toBeHidden();
      await expect(
        page.getByText("Task 'test-cloud' scheduled to restart"),
      ).toBeVisible();
    });

    test("filter button applies task and build variant filters", async ({
      authenticatedPage: page,
    }) => {
      await page.locator(knownIssueTask).click({ modifiers: ["Alt"] });
      const popup = page.getByTestId("task-overview-popup");
      await expect(popup).toBeVisible();

      const filterButton = page.getByRole("button", { name: "Filter" });
      await expect(filterButton).toBeVisible();
      await filterButton.click();

      await expect(popup).toBeHidden();
      await expect(page).toHaveURL(/tasks=test-cloud/);
      await expect(page).toHaveURL(/buildVariants=ubuntu1604/);
    });

    test("task logs button navigates to Parsley", async ({
      authenticatedPage: page,
    }) => {
      await page.locator(knownIssueTask).click({ modifiers: ["Alt"] });
      const popup = page.getByTestId("task-overview-popup");
      await expect(popup).toBeVisible();

      const logsLink = page.getByRole("link", { name: "Logs" });
      await expect(logsLink).toBeVisible();
      await expect(logsLink).toHaveAttribute(
        "href",
        `http://localhost:5173/evergreen/${knownIssueTaskId}/0/task`,
      );
    });

    test("task history button navigates to task history tab", async ({
      authenticatedPage: page,
    }) => {
      await page.locator(knownIssueTask).click({ modifiers: ["Alt"] });
      await expect(page.getByTestId("task-overview-popup")).toBeVisible();

      const historyLink = page.getByRole("link", { name: "History" });
      await expect(historyLink).toBeVisible();
      await expect(historyLink).toHaveAttribute(
        "href",
        `/task/${knownIssueTaskId}/history?execution=0`,
      );
    });
  });
});
