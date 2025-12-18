import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import {
  LogkeeperBuildMetadataQuery,
  LogkeeperBuildMetadataQueryVariables,
  TaskTestsForJobLogsQuery,
  TaskTestsForJobLogsQueryVariables,
} from "gql/generated/types";
import { LOGKEEPER_BUILD_METADATA, TASK_TESTS_FOR_JOB_LOGS } from "gql/queries";
import { JobLogsMetadata, JobLogsTableTestResult } from "./types";
import { getFormattedTestResults, getTitle, getMetadata } from "./utils";

interface UseJobLogsPageParams {
  isLogkeeper: boolean;
  buildId?: string;
  taskId?: string;
  execution?: string;
  groupId?: string;
  onError: (err: string) => void;
}

type JobLogsPageData = {
  title: React.ReactNode;
  resultsToRender: JobLogsTableTestResult[];
  loading: boolean;
  status: string;
  metadata: JobLogsMetadata;
};
const useJobLogsPageData = ({
  buildId,
  execution,
  groupId,
  isLogkeeper,
  onError,
  taskId,
}: UseJobLogsPageParams): JobLogsPageData => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const executionAsInt = parseInt(execution, 10);
  const lastLogkeeperError = useRef<string | null>(null);
  const lastEvergreenError = useRef<string | null>(null);

  const {
    data: logkeeperData,
    error: logkeeperError,
    loading: loadingLogkeeper,
  } = useQuery<
    LogkeeperBuildMetadataQuery,
    LogkeeperBuildMetadataQueryVariables
  >(LOGKEEPER_BUILD_METADATA, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { buildId },
    skip: !isLogkeeper,
  });

  useEffect(() => {
    if (
      logkeeperError &&
      logkeeperError.message !== lastLogkeeperError.current
    ) {
      lastLogkeeperError.current = logkeeperError.message;
      onError(
        `There was an error retrieving logs for this build: ${logkeeperError.message}`,
      );
    }
    if (!logkeeperError) {
      lastLogkeeperError.current = null;
    }
  }, [logkeeperError, onError]);

  const {
    data: testResultsData,
    error: evergreenError,
    loading: loadingEvergreen,
  } = useQuery<TaskTestsForJobLogsQuery, TaskTestsForJobLogsQueryVariables>(
    TASK_TESTS_FOR_JOB_LOGS,
    {
      variables: {
        id: taskId || logkeeperData?.logkeeperBuildMetadata?.taskId || "",
        execution:
          executionAsInt ||
          logkeeperData?.logkeeperBuildMetadata?.taskExecution ||
          0,
      },
      // Skip the query if we're in logkeeper mode and the logkeeper query is still loading
      skip: isLogkeeper && (loadingLogkeeper || logkeeperData === undefined),
    },
  );

  useEffect(() => {
    if (
      evergreenError &&
      evergreenError.message !== lastEvergreenError.current
    ) {
      lastEvergreenError.current = evergreenError.message;
      onError(
        `There was an error retrieving logs for this task: ${evergreenError.message}`,
      );
    }
    if (!evergreenError) {
      lastEvergreenError.current = null;
    }
  }, [evergreenError, onError]);

  const { logkeeperBuildMetadata } = logkeeperData || {};

  const { task: evergreenTask } = testResultsData || {};

  const resultsToRender = getFormattedTestResults(
    logkeeperBuildMetadata?.tests,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    evergreenTask?.tests?.testResults,
    groupId,
  );

  const metadata = getMetadata(isLogkeeper, {
    logkeeperBuildMetadata,
    evergreenTask,
    groupId,
    buildId,
  });
  const title = getTitle(isLogkeeper, metadata);
  return {
    resultsToRender,
    title,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    status: evergreenTask?.status,
    loading: loadingEvergreen || loadingLogkeeper,
    metadata,
  };
};

export default useJobLogsPageData;
