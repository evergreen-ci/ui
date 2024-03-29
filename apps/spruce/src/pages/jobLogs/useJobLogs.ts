import { useQuery } from "@apollo/client";
import {
  LogkeeperBuildMetadataQuery,
  LogkeeperBuildMetadataQueryVariables,
  TaskTestsForJobLogsQuery,
  TaskTestsForJobLogsQueryVariables,
} from "gql/generated/types";
import { LOGKEEPER_BUILD_METADATA, TASK_TESTS_FOR_JOB_LOGS } from "gql/queries";
import { JobLogsTableTestResult } from "./types";
import { getFormattedTestResults, getTitle } from "./utils";

interface UseJobLogsPageParams {
  isLogkeeper: boolean;
  buildId?: string;
  taskId?: string;
  execution?: string;
  groupId?: string;
  onError: (err: string) => void;
}

type JobLogsPageData = {
  taskId: string;
  execution: number;
  title: string;
  resultsToRender: JobLogsTableTestResult[];
  loading: boolean;
};
const useJobLogsPageData = ({
  buildId,
  execution,
  groupId,
  isLogkeeper,
  onError,
  taskId,
}: UseJobLogsPageParams): JobLogsPageData => {
  const executionAsInt = parseInt(execution, 10);
  const { data: logkeeperData, loading: loadingLogkeeper } = useQuery<
    LogkeeperBuildMetadataQuery,
    LogkeeperBuildMetadataQueryVariables
  >(LOGKEEPER_BUILD_METADATA, {
    variables: { buildId },
    skip: !isLogkeeper,
    onError: (err) => {
      onError(
        `There was an error retrieving logs for this build: ${err.message}`,
      );
    },
  });

  const { data: testResultsData, loading: loadingEvergreen } = useQuery<
    TaskTestsForJobLogsQuery,
    TaskTestsForJobLogsQueryVariables
  >(TASK_TESTS_FOR_JOB_LOGS, {
    variables: {
      id: taskId,
      execution: executionAsInt,
    },
    skip: isLogkeeper,
    onError: (err) => {
      onError(
        `There was an error retrieving logs for this task: ${err.message}`,
      );
    },
  });

  const { logkeeperBuildMetadata } = logkeeperData || {};

  const { task: evergreenTestResults } = testResultsData || {};

  const resultsToRender = getFormattedTestResults(
    logkeeperBuildMetadata?.tests,
    evergreenTestResults?.tests?.testResults,
    groupId,
  );

  const title = getTitle(isLogkeeper, {
    logkeeperBuildMetadata,
    groupId,
  });
  return {
    taskId: isLogkeeper
      ? logkeeperData?.logkeeperBuildMetadata?.taskId
      : taskId,
    execution: isLogkeeper
      ? logkeeperData?.logkeeperBuildMetadata?.taskExecution
      : executionAsInt,
    resultsToRender,
    title,
    loading: loadingEvergreen || loadingLogkeeper,
  };
};

export default useJobLogsPageData;
