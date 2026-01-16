import { useQuery } from "@apollo/client/react";
import { useParams, useLocation } from "react-router-dom";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import { TaskLogsQuery, TaskLogsQueryVariables } from "gql/generated/types";
import { TASK_LOGS } from "gql/queries";
import { usePolling } from "hooks";
import { RequiredQueryParams } from "types/task";
import { queryString } from "utils";
import { Props } from "./types";
import { useRenderBody } from "./useRenderBody";

const { parseQueryString } = queryString;

export const TaskLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskLogsQuery,
    TaskLogsQueryVariables
  >(TASK_LOGS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading task logs");
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data || {};
  const { taskLogs } = task || {};

  return useRenderBody({
    data: taskLogs?.taskLogs || [],
    loading,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    error,
    ...props,
  });
};
