import { TaskStatus } from "@evg-ui/lib/types/task";
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
          status: task.status,
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
  testNamePattern: string,
  statuses: string[],
  variants: string[],
): GroupedTestMap => {
  const filteredTests = new Map<string, TaskBuildVariantField[]>();
  const regex = new RegExp(testNamePattern);

  const hasStatuses = statuses && statuses.length > 0;
  const hasVariants = variants && variants.length > 0;
  const statusSet = new Set(statuses);
  const variantSet = new Set(variants);
  groupedTests.forEach((tasks, testName) => {
    if (!regex.test(testName)) return;

    const filteredTasks = tasks.filter((task) => {
      const statusMatch = !hasStatuses || statusSet.has(task.status);
      const variantMatch = !hasVariants || variantSet.has(task.buildVariant);
      return statusMatch && variantMatch;
    });

    if (filteredTasks.length > 0) {
      filteredTests.set(testName, filteredTasks);
    }
  });

  return filteredTests;
};

type BuildVariantNameTuple = {
  buildVariant: string;
  buildVariantDisplayName: string;
};
/**
 * `getAllBuildVariants` extracts all unique buildVariants from a map of test names to TaskBuildVariantField arrays.
 * @param taskMap - A Map of test names to an array of TaskBuildVariantField objects.
 * @returns - An array of unique buildVariants.
 */
const getAllBuildVariants = (
  taskMap: Map<string, TaskBuildVariantField[]>,
): BuildVariantNameTuple[] => {
  const buildVariantMap = new Map<string, string>();

  taskMap.forEach((taskArray) => {
    taskArray.forEach((task) => {
      const displayName = task.buildVariantDisplayName || task.buildVariant;
      buildVariantMap.set(task.buildVariant, displayName);
    });
  });

  return Array.from(buildVariantMap.entries()).map(
    ([buildVariant, buildVariantDisplayName]) => ({
      buildVariant,
      buildVariantDisplayName,
    }),
  );
};

/**
 * `getAllTaskStatuses` extracts all unique statuses from a map of test names to TaskBuildVariantField arrays.
 * @param taskMap - A Map of test names to an array of TaskBuildVariantField objects.
 * @returns - An array of unique statuses.
 */
const getAllTaskStatuses = (taskMap: Map<string, TaskBuildVariantField[]>) => {
  const statusSet = new Set<TaskStatus>();

  taskMap.forEach((taskArray) => {
    taskArray.forEach((task) => {
      statusSet.add(task.status as TaskStatus);
    });
  });

  return Array.from(statusSet);
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

export {
  countTotalTests,
  groupTestsByName,
  filterGroupedTests,
  getAllBuildVariants,
  getAllTaskStatuses,
};
