import { expect, test } from "../../fixtures";

test.describe("Tab shortcut", () => {
  test("toggle through tabs with 'j' and 'k' on version page", async ({
    page,
  }) => {
    await page.goto("/version/5f74d99ab2373627c047c5e5/");

    const taskTab = page.getByRole("tab", { name: "Tasks", exact: true });
    const durationTab = page.getByRole("tab", {
      name: "Task Duration",
      exact: true,
    });
    const changesTab = page.getByRole("tab", { name: "Changes", exact: true });
    const downstreamTab = page.getByRole("tab", {
      name: /^Downstream Projects/,
    });
    const testAnalysisTab = page.getByRole("tab", {
      name: "Test Analysis",
      exact: true,
    });
    const versionTimingTab = page.getByRole("tab", {
      name: "Version Timing",
      exact: true,
    });

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
    page,
  }) => {
    await page.goto("/patch/5f74d99ab2373627c047c5e5/configure");

    const tasksTab = page.getByRole("tab", { name: "Configure", exact: true });
    const changesTab = page.getByRole("tab", { name: "Changes", exact: true });
    const parametersTab = page.getByRole("tab", {
      name: "Parameters",
      exact: true,
    });

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
    page,
  }) => {
    await page.goto(
      "/task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/execution-tasks",
    );

    const taskLogsTab = page.getByRole("tab", { name: "Logs", exact: true });
    const taskExecutionTab = page.getByRole("tab", {
      name: "Execution Tasks",
      exact: true,
    });
    const taskTestsTab = page.getByRole("tab", { name: /^Tests/ });
    const taskFilesTab = page.getByRole("tab", { name: /^Files/ });
    const taskHistoryTab = page.getByRole("tab", {
      name: "History",
      exact: true,
    });
    const executionTasksTimingTab = page.getByRole("tab", {
      name: "Execution Tasks Timing",
      exact: true,
    });

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

    await expect(taskLogsTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");

    await expect(taskExecutionTab).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");

    await expect(taskLogsTab).toHaveAttribute("aria-selected", "true");
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
    await page.locator("body").press("k");

    await expect(taskExecutionTab).toHaveAttribute("aria-selected", "true");
  });
});
