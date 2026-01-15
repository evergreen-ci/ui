import { useEffect } from "react";
import { ApolloError } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams, useLocation } from "react-router-dom";
import { size, fontSize } from "@evg-ui/lib/constants/tokens";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import {
  TaskEventLogsQuery,
  TaskEventLogsQueryVariables,
  SystemLogsQuery,
  SystemLogsQueryVariables,
  AgentLogsQuery,
  AgentLogsQueryVariables,
  TaskLogsQuery,
  TaskLogsQueryVariables,
  AllLogsQuery,
  AllLogsQueryVariables,
  TaskEventLogEntry,
  LogMessageFragment,
} from "gql/generated/types";
import {
  AGENT_LOGS,
  TASK_EVENT_LOGS,
  SYSTEM_LOGS,
  TASK_LOGS,
  ALL_LOGS,
} from "gql/queries";
import { usePolling } from "hooks";
import { RequiredQueryParams } from "types/task";
import { queryString } from "utils";
import { LogMessageLine } from "./logTypes/LogMessageLine";
import { TaskEventLogLine } from "./logTypes/TaskEventLogLine";

const { parseQueryString } = queryString;

const { gray } = palette;

interface TaskEventLogEntryType extends TaskEventLogEntry {
  kind?: "taskEventLogEntry";
}
interface LogMessageType extends LogMessageFragment {
  kind?: "logMessage";
}
interface Props {
  setNoLogs: (noLogs: boolean) => void;
}

export const AllLog: React.FC<Props> = (props) => {
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
  useErrorToast(error, "There was an error loading all logs");
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

export const SystemLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    SystemLogsQuery,
    SystemLogsQueryVariables
  >(SYSTEM_LOGS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading system logs");
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { systemLogs } = taskLogs || {};

  return useRenderBody({
    data: systemLogs || [],
    loading,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    error,
    ...props,
  });
};

export const AgentLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    AgentLogsQuery,
    AgentLogsQueryVariables
  >(AGENT_LOGS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading agent logs");
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { agentLogs } = taskLogs || {};

  return useRenderBody({
    data: agentLogs || [],
    loading,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    error,
    ...props,
  });
};

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

const useRenderBody: React.FC<{
  loading: boolean;
  error: ApolloError;
  data: (TaskEventLogEntryType | LogMessageType)[];
  LogContainer?: React.FC<{ children: React.ReactNode }>;
  setNoLogs: (noLogs: boolean) => void;
}> = ({
  LogContainer = ({ children }) => <StyledPre>{children}</StyledPre>,
  data,
  error,
  loading,
  setNoLogs,
}) => {
  const noLogs = error !== undefined || data.length === 0;
  // Update the value of noLogs in the parent component.
  useEffect(() => {
    setNoLogs(noLogs);
  }, [setNoLogs, noLogs]);

  if (loading) {
    return <ParagraphSkeleton />;
  }
  if (noLogs) {
    return <div data-cy="cy-no-logs">No logs found</div>;
  }
  return (
    <LogContainer>
      {data.map((d, index) =>
        d.kind === "taskEventLogEntry" ? (
          <TaskEventLogLine
            key={`${d.resourceId}_${d.id}_${index}`} // eslint-disable-line react/no-array-index-key
            {...d}
          />
        ) : (
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          <LogMessageLine
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            key={`${d.message}_${d.timestamp}_${index}`} // eslint-disable-line react/no-array-index-key
            {...d}
          />
        ),
      )}
    </LogContainer>
  );
};

const StyledPre = styled.pre`
  border: 1px solid ${gray.light2};
  border-radius: ${size.xxs};
  font-size: ${fontSize.m};
  overflow: scroll hidden;
  padding: ${size.xs};
`;
