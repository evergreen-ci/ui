import {
  getParsleyBuildLogURL,
  getParsleyCompleteLogsURL,
} from "constants/externalResources";
import {
  LogkeeperBuildMetadataQuery,
  TaskTestsForJobLogsQuery,
} from "gql/generated/types";
import { TaskStatus } from "types/task";
import {
  JobLogsTableTestResult,
  LogkeeperTestResult,
  EvergreenTestResult,
  JobLogsMetadata,
} from "./types";

const getMetadata = (
  isLogkeeper: boolean,
  options: {
    logkeeperBuildMetadata:
      | LogkeeperBuildMetadataQuery["logkeeperBuildMetadata"]
      | undefined;
    evergreenTask: TaskTestsForJobLogsQuery["task"] | undefined;
    groupId: string | undefined;
    buildId: string | undefined;
  },
): JobLogsMetadata => {
  const { displayName, execution, id, status } = options.evergreenTask || {};

  if (isLogkeeper) {
    const { buildNum, builder } = options.logkeeperBuildMetadata || {};
    return {
      // @ts-ignore: FIXME. This comment was added by an automated script.
      completeLogsURL: getParsleyBuildLogURL(options.buildId),
      builder,
      buildId: options.buildId,
      buildNum,
      displayName,
      // @ts-ignore: FIXME. This comment was added by an automated script.
      execution,
      isLogkeeper,
      // @ts-ignore: FIXME. This comment was added by an automated script.
      taskId: id,
      taskStatus: status as TaskStatus,
    };
  }
  return {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    completeLogsURL: getParsleyCompleteLogsURL(id, execution, options.groupId),
    displayName,
    // @ts-ignore: FIXME. This comment was added by an automated script.
    execution,
    groupID: options.groupId,
    isLogkeeper,
    // @ts-ignore: FIXME. This comment was added by an automated script.
    taskId: id,
    taskStatus: status as TaskStatus,
  };
};

const getTitle = (isLogkeeper: boolean, metadata: JobLogsMetadata) => {
  if (isLogkeeper) {
    const { buildNum, builder, displayName } = metadata;
    if (!builder || !buildNum || !displayName) {
      return "";
    }
    return `Job Logs - ${builder} - ${buildNum} - ${displayName}`;
  }
  return `Job Logs - ${metadata.displayName} - ${metadata.groupID}`;
};

const getFormattedTestResults = (
  logkeeperTestResults: LogkeeperTestResult[] | undefined,
  evergreenTestResults: EvergreenTestResult[] | undefined,
  groupID: string | undefined,
): JobLogsTableTestResult[] => {
  if (logkeeperTestResults) {
    return logkeeperTestResults;
  }
  if (evergreenTestResults) {
    return evergreenTestResults.filter((test) => test.groupID === groupID);
  }
  return [];
};

export { getTitle, getFormattedTestResults, getMetadata };
