import {
  LogkeeperBuildMetadataQuery,
  TaskTestsForJobLogsQuery,
} from "gql/generated/types";
import {
  JobLogsTableTestResult,
  LogkeeperTestResult,
  EvergreenTestResult,
} from "./types";

const getTitle = (
  logkeeperBuildMetadataData: LogkeeperBuildMetadataQuery | undefined,
  taskTestsForJobLogsData: TaskTestsForJobLogsQuery | undefined,
  groupId: string | undefined,
) => {
  if (!logkeeperBuildMetadataData || !taskTestsForJobLogsData) {
    return "Job Logs";
  }
  if (logkeeperBuildMetadataData.logkeeperBuildMetadata) {
    const { logkeeperBuildMetadata } = logkeeperBuildMetadataData;
    const { buildNum, builder } = logkeeperBuildMetadata;
    return `${builder} - ${buildNum}`;
  }
  return `Job Logs - ${groupId}`;
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

export { getTitle, getFormattedTestResults };
