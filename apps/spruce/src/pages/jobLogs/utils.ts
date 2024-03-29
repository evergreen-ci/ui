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
  isLogkeeper: boolean,
  options: {
    logkeeperBuildMetadata:
      | LogkeeperBuildMetadataQuery["logkeeperBuildMetadata"]
      | undefined;
    groupId: string | undefined;
  },
) => {
  switch (isLogkeeper) {
    case true: {
      const { buildNum, builder } = options.logkeeperBuildMetadata;
      return `${builder} - ${buildNum}`;
    }
    case false:
      return `Job Logs - ${options.groupId}`;
    default:
      return "Job Logs";
  }
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
