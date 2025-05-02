import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { LogTypes } from "constants/enums";
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables,
} from "gql/generated/types";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { useTaskQuery } from "hooks/useTaskQuery";

// Define GraphQL queries using gql tag for tests
const GET_TEST_LOG_URL_AND_RENDERING_TYPE = process.env.NODE_ENV === 'test'
  ? gql`
    query TestLogUrlAndRenderingType($taskID: String!, $testName: String!, $execution: Int) {
      task(taskId: $taskID, execution: $execution) {
        id
        tests {
          testResults {
            id
            logs {
              renderingType
              url
              urlRaw
            }
            status
            testFile
          }
        }
      }
    }
  `
  : require('gql/queries/get-test-log-url-and-rendering-type.graphql');

const TASK_FILES = process.env.NODE_ENV === 'test'
  ? gql`
    query TaskFiles($taskId: String!, $execution: Int) {
      task(taskId: $taskId, execution: $execution) {
        id
        execution
        files {
          groupedFiles {
            taskId
            taskName
            execution
            files {
              name
              link
            }
          }
        }
      }
    }
  `
  : require('gql/queries/task-files.graphql');

interface UseResolveLogURLAndRenderingTypeProps {
  execution?: string;
  fileName?: string;
  logType?: LogTypes;
  origin?: string;
  taskID?: string;
  testID?: string;
}

interface UseResolveLogURLAndRenderingTypeReturn {
  htmlLogURL: string;
  loading: boolean;
  rawLogURL: string;
  renderingType: string;
}

export const useResolveLogURLAndRenderingType = ({
  execution,
  fileName,
  logType,
  origin,
  taskID,
  testID,
}: UseResolveLogURLAndRenderingTypeProps): UseResolveLogURLAndRenderingTypeReturn => {
  const { task: taskData, loading: taskLoading } = useTaskQuery({
    execution,
    logType,
    taskID,
  });

  const { data: testLogData, loading: testLogLoading } = useQuery<
    TestLogUrlAndRenderingTypeQuery,
    TestLogUrlAndRenderingTypeQueryVariables
  >(GET_TEST_LOG_URL_AND_RENDERING_TYPE, {
    skip:
      logType !== LogTypes.EVERGREEN_TEST_LOGS ||
      !taskID ||
      !testID ||
      !execution,
    variables: {
      execution: Number(execution),
      taskID,
      testName: `^${testID}$`,
    },
  });

  const { data: taskFilesData, loading: taskFilesLoading } = useQuery<
    TaskFilesQuery,
    TaskFilesQueryVariables
  >(TASK_FILES, {
    skip:
      logType !== LogTypes.EVERGREEN_TASK_FILE ||
      !taskID ||
      !fileName ||
      !execution,
    variables: {
      execution: Number(execution),
      taskId: taskID,
    },
  });

  const loading = taskLoading || testLogLoading || taskFilesLoading;

  if (loading) {
    return {
      htmlLogURL: "",
      loading,
      rawLogURL: "",
      renderingType: "",
    };
  }

  if (logType === LogTypes.EVERGREEN_TEST_LOGS) {
    const testResults = testLogData?.task?.tests?.testResults ?? [];
    if (testResults.length > 0) {
      const { logs } = testResults[0];
      const { renderingType, url, urlRaw } = logs ?? {};
      if (renderingType && renderingType !== "default" && renderingType !== "resmoke") {
        reportError(new Error("Encountered unsupported renderingType"), {
          context: {
            rawLogURL: urlRaw,
            unsupportedRenderingType: renderingType,
          },
        });
      }
      return {
        htmlLogURL: url ?? "",
        loading,
        rawLogURL: urlRaw ?? "",
        renderingType: renderingType === "resmoke" ? "resmoke" : "default",
      };
    }
    return {
      htmlLogURL: `${window.location.origin}/task_log_raw/${taskID}/${execution}?type=T&text=true&html=true&name=${testID}`,
      loading,
      rawLogURL: `${window.location.origin}/task_log_raw/${taskID}/${execution}?type=T&text=true&name=${testID}`,
      renderingType: "default",
    };
  }

  if (logType === LogTypes.EVERGREEN_TASK_FILE) {
    const groupedFiles = taskFilesData?.task?.files?.groupedFiles ?? [];
    if (groupedFiles.length > 0) {
      const { files } = groupedFiles[0];
      const file = files?.find((f) => f?.name === fileName);
      if (file) {
        return {
          htmlLogURL: file.link ?? "",
          loading,
          rawLogURL: file.link ?? "",
          renderingType: "default",
        };
      }
    }
    return {
      htmlLogURL: "",
      loading,
      rawLogURL: "",
      renderingType: "default",
    };
  }

  if (logType === LogTypes.EVERGREEN_TASK_LOGS) {
    const { logs } = taskData ?? {};
    let logURL = "";
    if (logs) {
      if (origin === "all") {
        logURL = logs.allLogLink ?? "";
      } else if (origin === "task") {
        logURL = logs.taskLogLink ?? "";
      } else if (origin === "agent") {
        logURL = logs.agentLogLink ?? "";
      } else if (origin === "system") {
        logURL = logs.systemLogLink ?? "";
      }
    }
    return {
      htmlLogURL: logURL.replace("?type=", "?text=true&html=true&type="),
      loading,
      rawLogURL: logURL.replace("?type=", "?text=true&type="),
      renderingType: "default",
    };
  }

  return {
    htmlLogURL: "",
    loading,
    rawLogURL: "",
    renderingType: "default",
  };
};
