import { useQuery } from "@apollo/client/react";
import { useErrorToast } from "@evg-ui/lib/hooks";
import {
  TaskTestsForJobLogsQuery,
  TaskTestsForJobLogsQueryVariables,
} from "gql/generated/types";
import { TASK_TESTS_FOR_JOB_LOGS } from "gql/queries";
import { EvergreenTestResult, JobLogsMetadata } from "./types";
import { getFormattedTestResults, getTitle, getMetadata } from "./utils";

interface UseJobLogsPageParams {
  taskId?: string;
  execution?: string;
  groupId?: string;
}

type JobLogsPageData = {
  title: React.ReactNode;
  resultsToRender: EvergreenTestResult[];
  loading: boolean;
  status: string;
  metadata: JobLogsMetadata;
};
const useJobLogsPageData = ({
  execution,
  groupId,
  taskId,
}: UseJobLogsPageParams): JobLogsPageData => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const executionAsInt = parseInt(execution, 10);

  const {
    data: testResultsData,
    error: evergreenError,
    loading,
  } = useQuery<TaskTestsForJobLogsQuery, TaskTestsForJobLogsQueryVariables>(
    TASK_TESTS_FOR_JOB_LOGS,
    {
      variables: {
        id: taskId || "",
        execution: executionAsInt || 0,
      },
    },
  );
  useErrorToast(
    evergreenError,
    "There was an error retrieving logs for this task",
  );

  const { task: evergreenTask } = testResultsData || {};

  const resultsToRender = getFormattedTestResults(
    evergreenTask?.tests?.testResults,
    groupId,
  );

  const metadata = getMetadata({
    evergreenTask,
    groupId,
  });
  const title = getTitle(metadata);
  return {
    resultsToRender,
    title,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    status: evergreenTask?.status,
    loading,
    metadata,
  };
};

export default useJobLogsPageData;
