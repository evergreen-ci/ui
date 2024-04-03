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
    evergreenTask: TaskTestsForJobLogsQuery["task"] | undefined;
    groupId: string | undefined;
  },
) => {
  switch (isLogkeeper) {
    case true: {
      const { displayName } = options.evergreenTask || {};
      const { buildNum, builder } = options.logkeeperBuildMetadata || {};
      if (!builder || !buildNum || !displayName) {
        return "";
      }
      return (
        <>
          <span title="Builder">{builder}</span> -{" "}
          <span title="Build number">{buildNum}</span> -{" "}
          <span title="Task display name">{displayName}</span>
        </>
      );
    }
    case false: {
      const { displayName } = options.evergreenTask || {};
      return (
        <>
          <span title="Task display name">{displayName}</span> -{" "}
          <span title="Group ID">{options.groupId}</span>
        </>
      );
    }
    default:
      return "";
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
