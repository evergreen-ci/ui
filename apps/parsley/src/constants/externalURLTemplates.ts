import {
  evergreenURL,
  logkeeperURL,
  spruceURL,
} from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

const getEvergreenTaskURL = (taskID: string, execution: string | number) => {
  const params = {
    redirect_spruce_users: true,
  };
  return `${evergreenURL}/task/${taskID}/${execution}?${stringifyQuery(
    params,
  )}`;
};

const getLogkeeperJobLogsURL = (buildID: string) =>
  `${spruceURL}/job-logs/${buildID}`;

const getEvergreenJobLogsURL = (
  taskID: string,
  execution: string | number,
  groupID: string,
) => `${spruceURL}/job-logs/${taskID}/${execution}/${groupID}`;

const getLegacyJobLogsURL = (buildID: string) =>
  `${logkeeperURL}/build/${buildID}`;

export {
  getEvergreenTaskURL,
  getLogkeeperJobLogsURL,
  getLegacyJobLogsURL,
  getEvergreenJobLogsURL,
};
