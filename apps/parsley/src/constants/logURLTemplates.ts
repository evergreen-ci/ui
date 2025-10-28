import queryString from "query-string";
import {
  Origin,
  constructEvergreenTaskLogURL,
} from "@evg-ui/lib/constants/logURLTemplates";
import { stringifyQuery } from "@evg-ui/lib/utils/query-string";
import { Task as TaskType } from "gql/generated/types";
import {
  evergreenURL,
  logkeeperURL,
  spruceURL,
} from "utils/environmentVariables";

/**
 *
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param testID - the test ID of the test
 * @param options - the options for the test log
 * @param options.text - returns the raw test log
 * @param options.groupID - the group ID
 * @returns an Evergreen URL of the format `/test_log/${taskID}/${execution}?test_name=${testID}&group_id=${groupID}text=true`
 */
const getEvergreenTestLogURL = (
  taskID: string,
  execution: string | number,
  testID: string,
  options: { text?: boolean; groupID?: string },
) => {
  const { groupID, text } = options;
  const params = {
    group_id: groupID,
    test_name: testID,
    text,
  };
  return `${evergreenURL}/test_log/${taskID}/${execution}?${stringifyQuery(
    params,
  )}`;
};

/**
 *
 * @param buildID - the build ID of the resmoke job
 * @param options - the options for the resmoke log
 * @param options.testID - the testID of the resmoke log omitting this returns the full log
 * @param options.raw - returns the raw task log
 * @param options.html - returns the html viewer for the log
 * @param options.metadata - returns the build metadata associated with the log
 * @returns a Logkeeper URL of the format `/build/${buildID}/test/${testID}` or `/build/${buildID}/all`
 */
const getResmokeLogURL = (
  buildID: string,
  options: { testID?: string; raw?: boolean; html?: boolean; metadata?: true },
) => {
  const { html, metadata, raw, testID } = options;
  const params = {
    html,
    metadata,
    raw,
  };
  if (testID) {
    return `${logkeeperURL}/build/${buildID}/test/${testID}?${stringifyQuery(
      params,
    )}`;
  }
  return `${logkeeperURL}/build/${buildID}/all?${stringifyQuery(params)}`;
};

const getEvergreenTaskLogURL = (
  logLinks: TaskType["logs"],
  origin: string,
  params: { priority?: boolean; text?: boolean } = {},
) => {
  const url =
    {
      [Origin.Agent]: logLinks.agentLogLink,
      [Origin.System]: logLinks.systemLogLink,
      [Origin.Task]: logLinks.taskLogLink,
      [Origin.All]: logLinks.allLogLink,
    }[origin] ?? "";
  return queryString.stringifyUrl({ query: params, url });
};

const constructSpruceRawLogURL = (
  taskID: string,
  execution: string | number,
  origin: string,
) => {
  const params = {
    execution,
    origin,
  };
  return `${spruceURL}/task/${taskID}/raw-logs?${stringifyQuery(params)}`;
};

/**
 *
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param fileName - the name of the file in Evergreen
 * @returns an Evergreen URL of the format `/task_file_raw/${taskID}/${execution}/${fileName}`
 */
const getEvergreenTaskFileURL = (
  taskID: string,
  execution: string | number,
  fileName: string,
) => `${evergreenURL}/task_file_raw/${taskID}/${execution}/${fileName}`;

/**
 * getEvergreenCompleteLogsURL constructs an Evergreen URL to download complete logs for a task.
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param groupID - the group ID of the task
 * @returns an Evergreen URL of the format /rest/v2/tasks/${taskID}/build/TestLogs/${groupID}?execution=${execution}
 */
const getEvergreenCompleteLogsURL = (
  taskID: string,
  execution: string | number,
  groupID: string,
) =>
  `${evergreenURL}/rest/v2/tasks/${taskID}/build/TestLogs/${groupID}%2F?execution=${execution}`;

export {
  constructEvergreenTaskLogURL,
  constructSpruceRawLogURL,
  getEvergreenCompleteLogsURL,
  getEvergreenTaskFileURL,
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getResmokeLogURL,
};
