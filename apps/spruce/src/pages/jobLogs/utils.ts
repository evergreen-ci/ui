import { TaskStatus } from "@evg-ui/lib/types/task";
import { getParsleyCompleteLogsURL } from "constants/externalResources";
import { TaskTestsForJobLogsQuery } from "gql/generated/types";
import { EvergreenTestResult, JobLogsMetadata } from "./types";

const getMetadata = (options: {
  evergreenTask: TaskTestsForJobLogsQuery["task"] | undefined;
  groupId: string | undefined;
}): JobLogsMetadata => {
  const { displayName, displayStatus, execution, id } =
    options.evergreenTask || {};

  return {
    completeLogsURL: getParsleyCompleteLogsURL(
      id ?? "",
      execution ?? 0,
      options.groupId ?? "",
    ),
    displayName,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    execution,
    groupID: options.groupId,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    taskId: id,
    taskStatus: displayStatus as TaskStatus,
  };
};

const getTitle = (metadata: JobLogsMetadata) =>
  `Job Logs - ${metadata.displayName} - ${metadata.groupID}`;

const getFormattedTestResults = (
  evergreenTestResults: EvergreenTestResult[] | undefined,
  groupID: string | undefined,
): EvergreenTestResult[] => {
  if (evergreenTestResults) {
    return evergreenTestResults.filter((test) => test.groupID === groupID);
  }
  return [];
};

export { getTitle, getFormattedTestResults, getMetadata };
