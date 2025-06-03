import { TaskTab } from "types/task";

/**
 * Parameters needed to determine the default tab
 */
export interface GetDefaultTabParams {
  /** The tab specified in the URL, if any */
  urlTab?: TaskTab;
  /** Array of currently active tabs */
  activeTabs: TaskTab[];
  /** Whether this is a display task */
  isDisplayTask: boolean;
  /** Number of failed tests */
  failedTestCount: number;
}

/**
 * Determines the default tab to show based on various conditions. The priority order is:
 * 1. URL tab (if valid)
 * 2. Execution tasks (for display tasks)
 * 3. Tests tab (if there are failed tests)
 * 4. Logs tab (if no failed tests or not a display task)
 * 5. Tests tab (if there are any tests)
 * 6. First available tab
 * @param params - Object containing the parameters for determining the default tab
 * @param params.urlTab - The tab specified in the URL, if any
 * @param params.activeTabs - Array of currently active tabs
 * @param params.isDisplayTask - Whether this is a display task
 * @param params.failedTestCount - Number of failed tests
 * @returns The index of the default tab in the activeTabs array
 */
export const getDefaultTab = ({
  activeTabs,
  failedTestCount,
  isDisplayTask,
  urlTab,
}: GetDefaultTabParams): number => {
  // Priority 1: If a tab is specified in the URL and it's a valid tab, use it
  // This allows users to share links to specific tabs
  if (urlTab && activeTabs.includes(urlTab)) {
    return activeTabs.indexOf(urlTab);
  }

  // Priority 2: For display tasks, always show execution tasks first
  // Display tasks are special tasks that contain other tasks, so showing their execution tasks is most important
  if (isDisplayTask) {
    return activeTabs.indexOf(TaskTab.ExecutionTasks);
  }

  // Priority 3: If there are failed tests, show the tests tab
  // This helps users quickly see what went wrong
  if (failedTestCount > 0) {
    return activeTabs.indexOf(TaskTab.Tests);
  }

  // Priority 4: If no failed tests or not a display task, show logs
  // Logs are the most relevant for tasks that are running or completed successfully
  if (failedTestCount === 0 && !isDisplayTask) {
    return activeTabs.indexOf(TaskTab.Logs);
  }

  // Priority 5: Default to the first tab if none of the above conditions are met
  // This is a safe fallback that ensures we always show something
  return 0;
};
