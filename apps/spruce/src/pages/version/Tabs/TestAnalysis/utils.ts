import {
  TestAnalysisQueryTasks,
  TaskBuildVariantField,
  GroupedTestMap,
} from "./types";

/**
 * `groupTestsByName` takes an array of tasks and groups them by test name. Preserves the task name, build variant, id, and status of each task.
 * @param tasks - an array of tasks
 * @returns - a map of test names to an array of tasks
 */
const groupTestsByName = (
  tasks: TestAnalysisQueryTasks,
): Map<string, TaskBuildVariantField[]> => {
  const testMap = new Map<string, TaskBuildVariantField[]>();
  const processedTasks = new Set<string>();

  tasks.forEach((task) => {
    task.tests.testResults.forEach((test) => {
      const taskKey = `${task.id}-${test.testFile}`; // Create a unique key for task-test combinations

      if (!processedTasks.has(taskKey)) {
        const taskInfo: TaskBuildVariantField = {
          taskName: task.displayName,
          buildVariant: task.buildVariant,
          buildVariantDisplayName: task.buildVariantDisplayName,
          id: task.id,
          displayStatus: task.displayStatus,
          logs: {
            urlParsley: test.logs.urlParsley || "",
          },
        };

        if (!testMap.has(test.testFile)) {
          testMap.set(test.testFile, []);
        }
        testMap.get(test.testFile)!.push(taskInfo);
        processedTasks.add(taskKey); // Mark this task-test combination as processed
      }
    });
  });

  return testMap;
};

/**
 * Filters a map of test names to an array of tasks by matching test names with a regex,
 * and filtering tasks by statuses and build variants.
 * @param groupedTests - A map of test names to an array of tasks.
 * @param testNamePattern - A regex pattern to match test names.
 * @param statuses - The statuses to filter by.
 * @param variants - The build variants to filter by.
 * @returns - A map of test names to an array of tasks that match the given criteria.
 */
const filterGroupedTests = (
  groupedTests: GroupedTestMap,
  testNamePattern: RegExp,
  statuses: string[],
  variants: string[],
): GroupedTestMap => {
  const filteredTests = new Map<string, TaskBuildVariantField[]>();

  const statusSet = new Set(statuses);
  const variantSet = new Set(variants);
  const hasStatuses = statusSet.size > 0;
  const hasVariants = variantSet.size > 0;

  groupedTests.forEach((tasks, testName) => {
    if (!testNamePattern.test(testName)) return;

    const filteredTasks = tasks.filter((task) => {
      const statusMatch = !hasStatuses || statusSet.has(task.displayStatus);
      const variantMatch = !hasVariants || variantSet.has(task.buildVariant);
      return statusMatch && variantMatch;
    });

    if (filteredTasks.length > 0) {
      filteredTests.set(testName, filteredTasks);
    }
  });

  return filteredTests;
};

/**
 * `countTotalTests` counts the total number of tests accounting for a task running on multiple tasks and build variants.
 * @param taskMap - A Map of test names to an array of TaskBuildVariantField objects.
 * @returns - The total number of tests.
 */
const countTotalTests = (taskMap: Map<string, TaskBuildVariantField[]>) => {
  let totalTests = 0;
  taskMap.forEach((task) => {
    totalTests += task.length;
  });

  return totalTests;
};

export { countTotalTests, groupTestsByName, filterGroupedTests };
