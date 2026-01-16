import { useQuery } from "@apollo/client/react";
import { useParams, useLocation } from "react-router-dom";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import {
  TaskEventLogsQuery,
  TaskEventLogsQueryVariables,
  TaskEventLogEntry,
} from "gql/generated/types";
import { TASK_EVENT_LOGS } from "gql/queries";
import { usePolling } from "hooks";
import { RequiredQueryParams } from "types/task";
import { queryString } from "utils";
import { Props } from "./types";
import { useRenderBody } from "./useRenderBody";

const { parseQueryString } = queryString;

export const EventLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskEventLogsQuery,
    TaskEventLogsQueryVariables
  >(TASK_EVENT_LOGS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading event logs");
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { eventLogs } = taskLogs || {};

  return useRenderBody({
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    data: (eventLogs || []).map((v: TaskEventLogEntry) => ({
      ...v,
      kind: "taskEventLogEntry",
    })),
    loading,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    error,
    LogContainer: ({ children }) => <div>{children}</div>,
    ...props,
  });
};
