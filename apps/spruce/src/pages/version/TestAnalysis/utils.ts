import { TaskStatus } from "@evg-ui/lib/types/task";
import { Unpacked } from "@evg-ui/lib/types/utils";
import {
  TestAnalysisQueryTasks,
  TaskBuildVariantField,
  GroupedTestMap,
} from "./types";

/**
 * `groupTestsByName` takes an array of tasks and groups them by test name.
 *  Preserves the task name, build variant, id, and status of each task.
 *  Filters out any tests that only have one task.
 * @param tasks - an array of tasks
 * @returns - a map of test names to an array of tasks
 */
const groupTestsByName = (
  tasks: TestAnalysisQueryTasks,
): Map<string, TaskBuildVariantField[]> =>
  tasks.reduce((testMap, task) => {
    const tests = getTestsInTask(task.tests);
    const taskInfo: TaskBuildVariantField = {
      taskName: task.displayName,
      buildVariant: task.buildVariant,
      id: task.id,
      status: task.status,
      logs: {
        urlParsley: "",
      },
    };

    tests.forEach((test) => {
      if (!testMap.has(test.testFile)) {
        testMap.set(test.testFile, []);
      }
      taskInfo.logs.urlParsley = test.logs.urlParsley || "";
      testMap.get(test.testFile)!.push(taskInfo);
    });

    // Iterate over the testMap and filter out any tests that only have one task
    testMap.forEach((t, testName) => {
      console.log(t, testName);
      if (t.length === 1) {
        testMap.delete(testName);
      }
    });
    return testMap;
  }, new Map<string, TaskBuildVariantField[]>());

const getTestsInTask = (tests: Unpacked<TestAnalysisQueryTasks>["tests"]) =>
  tests.testResults.map((test) => ({
    testFile: test.testFile,
    logs: test.logs,
  }));

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
  statuses?: string[] | null,
  variants?: string[] | null,
): GroupedTestMap => {
  const filteredTests = new Map<string, TaskBuildVariantField[]>();
  const regex = new RegExp(testNamePattern);

  groupedTests.forEach((tasks, testName) => {
    if (regex.test(testName)) {
      const filteredTasks = tasks.filter(
        (task) =>
          ((statuses && statuses.length === 0) ||
            (statuses && statuses.includes(task.status))) &&
          ((variants && variants.length === 0) ||
            (variants && variants.includes(task.buildVariant))),
      );

      if (filteredTasks.length > 0) {
        filteredTests.set(testName, filteredTasks);
      }
    }
  });

  return filteredTests;
};

/**
 * `getAllBuildVariants` extracts all unique buildVariants from a map of test names to TaskBuildVariantField arrays.
 * @param taskMap - A Map of test names to an array of TaskBuildVariantField objects.
 * @returns - An array of unique buildVariants.
 */
const getAllBuildVariants = (
  taskMap: Map<string, TaskBuildVariantField[]>,
): string[] => {
  const buildVariantSet = new Set<string>();

  taskMap.forEach((taskArray) => {
    taskArray.forEach((task) => {
      buildVariantSet.add(task.buildVariant);
    });
  });

  return Array.from(buildVariantSet);
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
export {
  groupTestsByName,
  filterGroupedTests,
  getAllBuildVariants,
  getAllTaskStatuses,
};
