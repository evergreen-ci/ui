import { test, expect } from "../../fixtures";

test.describe("Tab shortcut", () => {
  test("toggle through tabs with 'j' and 'k' on version page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/version/5f74d99ab2373627c047c5e5/");

    const taskTab = page.getByTestId("task-tab");
    const durationTab = page.getByTestId("duration-tab");
    const changesTab = page.getByTestId("changes-tab");
    const downstreamTab = page.getByTestId("downstream-tab");
    const testAnalysisTab = page.getByTestId("test-analysis-tab");
    const versionTimingTab = page.getByTestId("version-timing-tab");

    await expect(taskTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(durationTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(changesTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(downstreamTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(testAnalysisTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(versionTimingTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(taskTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(versionTimingTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(testAnalysisTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(downstreamTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(changesTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(durationTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(taskTab).toHaveAttribute("aria-selected", "true");
  });

  test("toggle through tabs with 'j' and 'k' on configure page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/patch/5f74d99ab2373627c047c5e5/configure");

    const tasksTab = page.getByTestId("tasks-tab");
    const changesTab = page.getByTestId("changes-tab");
    const parametersTab = page.getByTestId("parameters-tab");

    await expect(tasksTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(changesTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(parametersTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(tasksTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(parametersTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(changesTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(tasksTab).toHaveAttribute("aria-selected", "true");
  });

  test("toggle through tabs with 'j' and 'k' on the task page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      "/task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/execution-tasks",
    );

    const taskExecutionTab = page.getByTestId("task-execution-tab");
    const taskTestsTab = page.getByTestId("task-tests-tab");
    const taskFilesTab = page.getByTestId("task-files-tab");
    const taskHistoryTab = page.getByTestId("task-history-tab");
    const executionTasksTimingTab = page.getByTestId(
      "execution-tasks-timing-tab",
    );

    await expect(taskExecutionTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(taskTestsTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(taskFilesTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(taskHistoryTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(executionTasksTimingTab).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");

    await expect(taskExecutionTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(taskTestsTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(taskExecutionTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(executionTasksTimingTab).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");

    await expect(taskHistoryTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(taskFilesTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(taskTestsTab).toHaveAttribute("aria-selected", "true");
  });
});
