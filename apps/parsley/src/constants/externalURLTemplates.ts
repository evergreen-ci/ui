import { stringifyQuery } from "@evg-ui/lib/utils/query-string";
import { evergreenURL, spruceURL } from "utils/environmentVariables";

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

export { getEvergreenTaskURL, getLogkeeperJobLogsURL, getEvergreenJobLogsURL };
