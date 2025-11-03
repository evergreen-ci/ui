import { getEvergreenUrl } from "../utils/environmentVariables";
import { stringifyQuery } from "../utils/query-string";

export enum Origin {
  Agent = "agent",
  System = "system",
  Task = "task",
  All = "all",
}

const mapOriginToType = {
  [Origin.Agent]: "E",
  [Origin.All]: "ALL",
  [Origin.System]: "S",
  [Origin.Task]: "T",
};

/**
 * constructEvergreenTaskLogURL constructs an Evergreen task link as a fallback using the task's parameters.
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param origin - the origin of the log
 * @param options - the options for the task log
 * @param options.priority - returned log includes a priority prefix on each line
 * @param options.text - returns the raw log associated with the task
 * @returns an Evergreen URL of the format `/task/${taskID}/${execution}?type=${OriginToType[origin]}&text=true`
 */
export const constructEvergreenTaskLogURL = (
  taskID: string,
  execution: string | number,
  origin: string,
  options: { priority?: boolean; text?: boolean },
) => {
  const { priority, text } = options;
  const params = {
    priority,
    text,
    type: mapOriginToType[origin as Origin] || undefined,
  };
  return `${getEvergreenUrl()}/task_log_raw/${taskID}/${execution}?${stringifyQuery(
    params,
  )}`;
};
