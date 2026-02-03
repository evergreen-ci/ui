import { stringifyQuery } from "@evg-ui/lib/utils";
import { evergreenURL, spruceURL } from "utils/environmentVariables";

const getEvergreenTaskURL = (taskID: string, execution: string | number) => {
  const params = {
    redirect_spruce_users: true,
  };
  return `${evergreenURL}/task/${taskID}/${execution}?${stringifyQuery(
    params,
  )}`;
};

const getProjectSettingsURL = (projectID: string, tab: string) =>
  `${spruceURL}/project/${projectID}/settings/${tab}`;

const getLogkeeperJobLogsURL = (buildID: string) =>
  `${spruceURL}/job-logs/${buildID}`;

const getEvergreenJobLogsURL = (
  taskID: string,
  execution: string | number,
  groupID: string,
) => `${spruceURL}/job-logs/${taskID}/${execution}/${groupID}`;

export {
  getEvergreenTaskURL,
  getProjectSettingsURL,
  getLogkeeperJobLogsURL,
  getEvergreenJobLogsURL,
};
