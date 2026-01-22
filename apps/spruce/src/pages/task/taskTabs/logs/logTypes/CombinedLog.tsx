import { useQuery } from "@apollo/client/react";
import { useParams, useLocation } from "react-router-dom";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import { AllLogsQuery, AllLogsQueryVariables } from "gql/generated/types";
import { ALL_LOGS } from "gql/queries";
import { usePolling } from "hooks";
import { RequiredQueryParams } from "types/task";
import { queryString } from "utils";
import { Props } from "./types";
import { useRenderBody } from "./useRenderBody";

const { parseQueryString } = queryString;

export const CombinedLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    AllLogsQuery,
    AllLogsQueryVariables
  >(ALL_LOGS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading combined logs");
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { allLogs } = taskLogs || {};

  // Combined logs includes task, system, and agent logs. Event logs are not included.
  return useRenderBody({
    data: allLogs || [],
    loading,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    error,
    ...props,
  });
};
