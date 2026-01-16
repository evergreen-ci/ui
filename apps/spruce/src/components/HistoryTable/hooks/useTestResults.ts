import { useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables,
  TaskTestResultSample,
} from "gql/generated/types";
import { TASK_TEST_SAMPLE } from "gql/queries";
import { array } from "utils";
import { useHistoryTable } from "../HistoryTableContext";
import { rowType } from "../types";

const { convertArrayToObject } = array;

/**
 * useTestResults is a hook that given an index checks if a commit has been loaded and has test filters applied and then fetches the test results for the given tasks
 * @param rowIndex - the index of the row in the history table
 * @returns getTaskMetadata - a function that given a task id returns the test results for that task
 */
const useTestResults = (rowIndex: number) => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { getItem, historyTableFilters } = useHistoryTable();
  let taskIds: string[] = [];
  let versionId = "";
  const hasTestFilters = historyTableFilters.length > 0;

  const commit = getItem(rowIndex);
  if (commit && commit.type === rowType.COMMIT && commit.commit) {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    taskIds = commit.commit.buildVariants.flatMap((buildVariant) =>
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      buildVariant.tasks.map((task) => task.id),
    );
    versionId = commit.commit.id;
  }

  const hasDataToQuery = taskIds.length > 0;
  const { data, loading } = useQuery<
    TaskTestSampleQuery,
    TaskTestSampleQueryVariables
  >(TASK_TEST_SAMPLE, {
    variables: {
      versionId,
      taskIds,
      filters: historyTableFilters,
    },
    skip: !hasDataToQuery,
  });

  const taskTestSample = data?.taskTestSample;
  const taskTestMap = useMemo<{
    [taskId: string]: TaskTestResultSample;
  }>(() => {
    if (taskTestSample != null) {
      return convertArrayToObject(taskTestSample, "taskId");
    }
    return {};
  }, [taskTestSample]);

  /** getTaskMetadata returns the properties for a task cell given a task id  */
  const getTaskMetadata = useCallback(
    (taskId: string) => {
      const taskTest = taskTestMap[taskId];
      if (taskTest) {
        const matchingTestNameCount =
          taskTest.matchingFailedTestNames?.length || 0;
        const label = `${matchingTestNameCount} / ${taskTest.totalTestCount} Failing Tests`;
        return {
          label: hasTestFilters ? label : "",
          inactive: hasTestFilters && matchingTestNameCount === 0,
          loading,
          failingTests: taskTest.matchingFailedTestNames,
        };
      }
      return {
        label: "",
        inactive: hasTestFilters,
        loading,
        failingTests: [],
      };
    },
    [hasTestFilters, loading, taskTestMap],
  );

  return { getTaskMetadata };
};

export default useTestResults;
