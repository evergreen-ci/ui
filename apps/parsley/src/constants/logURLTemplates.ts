import queryString from "query-string";
import {
  Origin,
  constructEvergreenTaskLogURL,
} from "@evg-ui/lib/constants/logURLTemplates";
import { Task as TaskType } from "gql/generated/types";
import { evergreenURL } from "utils/environmentVariables";

const getEvergreenTaskLogURL = (
  logLinks: TaskType["logs"],
  origin: string,
  params: { priority?: boolean; text?: boolean; time?: boolean } = {},
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
  getEvergreenCompleteLogsURL,
  getEvergreenTaskFileURL,
  getEvergreenTaskLogURL,
};
