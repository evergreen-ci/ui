import { useQuery } from "@apollo/client";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables,
} from "gql/generated/types";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { useTaskQuery } from "hooks/useTaskQuery";
import GET_TEST_LOG_URL_AND_RENDERING_TYPE from "gql/queries/get-test-log-url-and-rendering-type.graphql";
import TASK_FILES from "gql/queries/task-files.graphql";

interface UseResolveLogURLAndRenderingTypeProps {
  buildID?: string;
  execution?: string;
  fileName?: string;
  groupID?: string;
  logType?: LogTypes;
  origin?: string;
  taskID?: string;
  testID?: string;
}

interface UseResolveLogURLAndRenderingTypeReturn {
  downloadURL: string;
  failingCommand?: string;
  htmlLogURL: string;
  jobLogsURL?: string;
  loading: boolean;
  rawLogURL: string;
  renderingType: LogRenderingTypes;
}

export const useResolveLogURLAndRenderingType = ({
  buildID,
  execution,
  fileName,
  groupID,
  logType,
  origin,
  taskID,
  testID,
}: UseResolveLogURLAndRenderingTypeProps): UseResolveLogURLAndRenderingTypeReturn => {
  const { task: taskData, loading: taskLoading } = useTaskQuery({
    buildID,
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
      taskID: taskID || "",
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
      taskId: taskID || "",
    },
  });

  const loading = taskLoading || testLogLoading || taskFilesLoading;

  if (loading) {
    return {
      downloadURL: "",
      htmlLogURL: "",
      loading,
      rawLogURL: "",
      renderingType: "default" as LogRenderingTypes,
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
        downloadURL: urlRaw ?? "",
        htmlLogURL: url ?? "",
        loading,
        rawLogURL: urlRaw ?? "",
        renderingType: (renderingType === "resmoke" ? "resmoke" : "default") as LogRenderingTypes,
      };
    }
    return {
      downloadURL: `${window.location.origin}/task_log_raw/${taskID}/${execution}?type=T&text=true&name=${testID}`,
      htmlLogURL: `${window.location.origin}/task_log_raw/${taskID}/${execution}?type=T&text=true&html=true&name=${testID}`,
      loading,
      rawLogURL: `${window.location.origin}/task_log_raw/${taskID}/${execution}?type=T&text=true&name=${testID}`,
      renderingType: "default" as LogRenderingTypes,
    };
  }

  if (logType === LogTypes.EVERGREEN_TASK_FILE) {
    const groupedFiles = taskFilesData?.task?.files?.groupedFiles ?? [];
    if (groupedFiles.length > 0) {
      const { files } = groupedFiles[0];
      const file = files?.find((f) => f?.name === fileName);
      if (file) {
        return {
          downloadURL: file.link ?? "",
          htmlLogURL: file.link ?? "",
          loading,
          rawLogURL: file.link ?? "",
          renderingType: "default" as LogRenderingTypes,
        };
      }
    }
    return {
      downloadURL: "",
      htmlLogURL: "",
      loading,
      rawLogURL: "",
      renderingType: "default" as LogRenderingTypes,
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
      downloadURL: logURL.replace("?type=", "?text=true&type="),
      htmlLogURL: logURL.replace("?type=", "?text=true&html=true&type="),
      loading,
      rawLogURL: logURL.replace("?type=", "?text=true&type="),
      renderingType: "default" as LogRenderingTypes,
    };
  }

  return {
    downloadURL: "",
    htmlLogURL: "",
    loading,
    rawLogURL: "",
    renderingType: "default" as LogRenderingTypes,
  };
};
