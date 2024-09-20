import { Unpacked } from "@evg-ui/lib/types/utils";
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
): Map<string, TaskBuildVariantField[]> =>
  tasks.reduce((testMap, task) => {
    const tests = getTestsInTask(task.tests);
    const taskInfo = {
      taskName: task.displayName,
      buildVariant: task.buildVariant,
      id: task.id,
      status: task.status,
    };

    tests.forEach((test) => {
      if (!testMap.has(test)) {
        testMap.set(test, []);
      }
      testMap.get(test)!.push(taskInfo);
    });

    return testMap;
  }, new Map<string, TaskBuildVariantField[]>());

const getTestsInTask = (tests: Unpacked<TestAnalysisQueryTasks>["tests"]) =>
  tests.testResults.map((test) => test.testFile);

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
  statuses?: string[],
  variants?: string[],
): GroupedTestMap => {
  const filteredTests = new Map<string, TaskBuildVariantField[]>();
  const regex = new RegExp(testNamePattern);

  groupedTests.forEach((tasks, testName) => {
    if (regex.test(testName)) {
      const filteredTasks = tasks.filter(
        (task) =>
          (statuses === undefined || statuses.includes(task.status)) &&
          (variants === undefined || variants.includes(task.buildVariant)),
      );

      if (filteredTasks.length > 0) {
        filteredTests.set(testName, filteredTasks);
      }
    }
  });

  return filteredTests;
};

export { groupTestsByName, filterGroupedTests };
