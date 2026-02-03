import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import {
  constructEvergreenTaskLogURL,
  getEvergreenTestLogURL,
} from "@evg-ui/lib/constants";
import { reportError } from "@evg-ui/lib/utils";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import {
  getEvergreenJobLogsURL,
  getLogkeeperJobLogsURL,
} from "constants/externalURLTemplates";
import {
  getEvergreenCompleteLogsURL,
  getEvergreenTaskFileURL,
  getEvergreenTaskLogURL,
  getResmokeLogURL,
} from "constants/logURLTemplates";
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables,
} from "gql/generated/types";
import { GET_TEST_LOG_URL_AND_RENDERING_TYPE, TASK_FILES } from "gql/queries";
import { useTaskQuery } from "hooks/useTaskQuery";

interface UseResolveLogURLAndRenderingTypeProps {
  buildID?: string;
  execution?: string;
  fileName?: string;
  // This groupID comes from the application URL.
  groupID?: string;
  logType: string;
  origin?: string;
  taskID?: string;
  testID?: string;
}

type HookResult = {
  /** The URL of the file parsley should download */
  downloadURL: string;
  /** The URL of the log file in the html log viewer */
  htmlLogURL: string;
  /** The URL of the RESMOKE logs job logs page in Spruce */
  jobLogsURL: string;
  /** The URL of the log file without any processing */
  rawLogURL: string;
  /** Whether the hook is actively making an network request or not  */
  loading: boolean;
  /** The rendering logic to use for the log when available */
  renderingType: LogRenderingTypes;
  /** The failing command in the log, if available */
  failingCommand: string;
};

/**
 * `useResolveLogURL` is a custom hook that resolves the log URL based on the log type and other parameters.
 * @param UseResolveLogURLAndRenderingTypeProps - The props for the hook
 * @param UseResolveLogURLAndRenderingTypeProps.buildID - The build ID of the log
 * @param UseResolveLogURLAndRenderingTypeProps.execution - The execution number of the log
 * @param UseResolveLogURLAndRenderingTypeProps.fileName - The name of the file being viewed
 * @param UseResolveLogURLAndRenderingTypeProps.groupID - The group ID of the test given from the URL
 * @param UseResolveLogURLAndRenderingTypeProps.logType - The type of log being viewed
 * @param UseResolveLogURLAndRenderingTypeProps.origin - The origin of the log
 * @param UseResolveLogURLAndRenderingTypeProps.taskID - The task ID of the log
 * @param UseResolveLogURLAndRenderingTypeProps.testID - The test ID of the log
 * @returns LogURLs
 */
export const useResolveLogURLAndRenderingType = ({
  buildID,
  execution,
  fileName,
  groupID,
  logType,
  origin,
  taskID,
  testID,
}: UseResolveLogURLAndRenderingTypeProps): HookResult => {
  const { loading: isLoadingTask, task } = useTaskQuery({
    buildID,
    execution,
    logType: logType as LogTypes,
    taskID,
  });

  // Testlog LogRenderingType is queried from EVG, the rest are inferred from logType.
  const { data: testData, loading: isLoadingTest } = useQuery<
    TestLogUrlAndRenderingTypeQuery,
    TestLogUrlAndRenderingTypeQueryVariables
  >(GET_TEST_LOG_URL_AND_RENDERING_TYPE, {
    skip: !(
      logType === LogTypes.EVERGREEN_TEST_LOGS &&
      taskID &&
      execution &&
      testID
    ),
    variables: {
      execution: parseInt(execution as string, 10),
      taskID: taskID as string,
      testName: `^${testID}$`,
    },
  });

  const { data: taskFileData, loading: isLoadingTaskFileData } = useQuery<
    TaskFilesQuery,
    TaskFilesQueryVariables
  >(TASK_FILES, {
    skip: !(logType === LogTypes.EVERGREEN_TASK_FILE && taskID && execution),
    variables: {
      execution: parseInt(execution as string, 10),
      taskId: taskID as string,
    },
  });

  let downloadURL = "";
  let rawLogURL = "";
  let htmlLogURL = "";
  let jobLogsURL = "";
  let renderingType: LogRenderingTypes = LogRenderingTypes.Default;
  let failingCommand = "";
  switch (logType) {
    case LogTypes.LOGKEEPER_LOGS: {
      if (buildID && testID) {
        rawLogURL = getResmokeLogURL(buildID, { raw: true, testID });
        htmlLogURL = getResmokeLogURL(buildID, { html: true, testID });
      } else if (buildID) {
        rawLogURL = getResmokeLogURL(buildID, { raw: true });
        htmlLogURL = getResmokeLogURL(buildID, { html: true });
      }
      if (buildID) {
        jobLogsURL = getLogkeeperJobLogsURL(buildID);
      }
      downloadURL = rawLogURL;
      renderingType = LogRenderingTypes.Resmoke;
      break;
    }
    case LogTypes.EVERGREEN_COMPLETE_LOGS: {
      if (!taskID || !execution || !groupID) {
        break;
      }
      downloadURL = getEvergreenCompleteLogsURL(taskID, execution, groupID);
      rawLogURL = downloadURL;
      jobLogsURL = getEvergreenJobLogsURL(taskID, execution, groupID);
      renderingType = LogRenderingTypes.Resmoke;
      break;
    }
    case LogTypes.EVERGREEN_TASK_FILE: {
      if (!taskID || !execution || isLoadingTaskFileData) {
        break;
      }
      if (taskID && execution && fileName) {
        downloadURL = getEvergreenTaskFileURL(
          taskID,
          execution,
          encodeURIComponent(fileName),
        );
        const allFiles = taskFileData?.task?.files.groupedFiles.flatMap(
          (group) => group.files,
        );
        rawLogURL =
          allFiles?.find((file) => file?.name === fileName)?.link || "";
      }
      renderingType = LogRenderingTypes.Default;
      break;
    }
    case LogTypes.EVERGREEN_TASK_LOGS: {
      if (!taskID || !origin || !execution || isLoadingTask) {
        break;
      }
      downloadURL = task?.logs
        ? getEvergreenTaskLogURL(task.logs, origin, {
            priority: true,
            text: true,
          })
        : constructEvergreenTaskLogURL(taskID, execution, origin, {
            priority: true,
            text: true,
          });
      rawLogURL = task?.logs
        ? getEvergreenTaskLogURL(task.logs, origin, {
            text: true,
          })
        : constructEvergreenTaskLogURL(taskID, execution, origin, {
            text: true,
          });
      htmlLogURL = task?.logs
        ? getEvergreenTaskLogURL(task.logs, origin, {
            text: false,
          })
        : constructEvergreenTaskLogURL(taskID, execution, origin, {
            text: false,
          });
      renderingType = LogRenderingTypes.Default;

      // TODO DEVPROD-9689: Parsley should not examine TaskEndDetail.description GQL type to determine failing log line
      const potentialFailingCommand =
        task?.details?.failingCommand || task?.details?.description;
      failingCommand =
        task?.details?.status === "failed" && potentialFailingCommand
          ? potentialFailingCommand
          : "";
      break;
    }
    case LogTypes.EVERGREEN_TEST_LOGS: {
      if (!taskID || !execution || !testID || isLoadingTest || !testData) {
        break;
      }
      const { groupID: groupIDFromQuery, logs } =
        testData?.task?.tests.testResults[0] || {};
      const { renderingType: renderingTypeFromQuery, url, urlRaw } = logs || {};
      rawLogURL =
        urlRaw ??
        getEvergreenTestLogURL(taskID, execution, testID, {
          text: true,
        });
      htmlLogURL =
        url ??
        getEvergreenTestLogURL(taskID, execution, testID, {
          text: false,
        });
      downloadURL = rawLogURL;
      if (!renderingTypeFromQuery) {
        renderingType = LogRenderingTypes.Default;
      } else if (
        Object.values<string>(LogRenderingTypes).includes(
          renderingTypeFromQuery,
        )
      ) {
        renderingType = renderingTypeFromQuery as LogRenderingTypes;
      } else {
        renderingType = LogRenderingTypes.Default;
      }
      if (groupIDFromQuery) {
        jobLogsURL = getEvergreenJobLogsURL(
          taskID,
          execution,
          groupIDFromQuery,
        );
      }
      break;
    }
    default:
      break;
  }

  // Report error when an unsupported renderingType is encountered.
  useEffect(() => {
    const { logs } = testData?.task?.tests.testResults[0] || {};
    const { renderingType: renderingTypeFromQuery, urlRaw } = logs || {};

    if (
      logType === LogTypes.EVERGREEN_TEST_LOGS &&
      renderingTypeFromQuery &&
      !Object.values(LogRenderingTypes).includes(
        renderingTypeFromQuery as LogRenderingTypes,
      )
    ) {
      reportError(new Error("Encountered unsupported renderingType"), {
        context: {
          rawLogURL: urlRaw || rawLogURL,
          unsupportedRenderingType: renderingTypeFromQuery,
        },
      }).severe();
    }
  }, [testData, logType, rawLogURL]);

  return {
    downloadURL,
    failingCommand,
    htmlLogURL,
    jobLogsURL,
    loading: isLoadingTest || isLoadingTask || isLoadingTaskFileData,
    rawLogURL,
    renderingType,
  };
};
