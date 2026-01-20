import { useEffect } from "react";
import { ErrorLike } from "@apollo/client";
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

const StyledPre = styled.pre`
  border: 1px solid ${gray.light2};
  border-radius: ${size.xxs};
  font-size: ${fontSize.m};
  overflow: scroll hidden;
  padding: ${size.xs};
`;

const LogBody: React.FC<{
  loading: boolean;
  error?: ErrorLike;
  data: (TaskEventLogEntryType | LogMessageType)[];
  setNoLogs: (noLogs: boolean) => void;
}> = ({ data, error, loading, setNoLogs }) => {
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

  const isEventLog = data.some((d) => d.kind === "taskEventLogEntry");

  if (isEventLog) {
    return (
      <div>
        {data.map((d, index) => {
          const entry = d as TaskEventLogEntryType;
          return (
            <TaskEventLogLine
              key={`${entry.resourceId}_${entry.id}_${index}`} // eslint-disable-line react/no-array-index-key
              {...entry}
            />
          );
        })}
      </div>
    );
  }
  return (
    <StyledPre>
      {data.map((d, index) => {
        const logMessage = d as LogMessageType;
        return (
          <LogMessageLine
            key={`${logMessage.message}_${logMessage.timestamp}_${index}`} // eslint-disable-line react/no-array-index-key
            {...logMessage}
          />
        );
      })}
    </StyledPre>
  );
};

export const AllLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const {
    data,
    dataState,
    error,
    loading,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<AllLogsQuery, AllLogsQueryVariables>(ALL_LOGS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading all logs");
  usePolling<AllLogsQuery, AllLogsQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  if (dataState !== "complete") {
    return null;
  }

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { allLogs } = taskLogs || {};

  // All logs includes task, system, and agent logs. Event logs are not included.
  return (
    <LogBody data={allLogs || []} error={error} loading={loading} {...props} />
  );
};

export const EventLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const {
    data,
    dataState,
    error,
    loading,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<TaskEventLogsQuery, TaskEventLogsQueryVariables>(
    TASK_EVENT_LOGS,
    {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      variables: { id: taskId, execution: selectedExecution },
      pollInterval: DEFAULT_POLL_INTERVAL,
    },
  );
  useErrorToast(error, "There was an error loading event logs");
  usePolling<TaskEventLogsQuery, TaskEventLogsQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  if (dataState !== "complete") {
    return null;
  }

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { eventLogs } = taskLogs || {};

  const logs: TaskEventLogEntryType[] =
    eventLogs?.map((log) => ({
      ...log,
      kind: "taskEventLogEntry" as const,
    })) ?? [];

  return <LogBody data={logs} error={error} loading={loading} {...props} />;
};

export const SystemLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const {
    data,
    dataState,
    error,
    loading,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<SystemLogsQuery, SystemLogsQueryVariables>(SYSTEM_LOGS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading system logs");
  usePolling<SystemLogsQuery, SystemLogsQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  if (dataState !== "complete") {
    return null;
  }

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { systemLogs } = taskLogs || {};

  return (
    <LogBody
      data={systemLogs || []}
      error={error}
      loading={loading}
      {...props}
    />
  );
};

export const AgentLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const {
    data,
    dataState,
    error,
    loading,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<AgentLogsQuery, AgentLogsQueryVariables>(AGENT_LOGS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading agent logs");
  usePolling<AgentLogsQuery, AgentLogsQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  if (dataState !== "complete") {
    return null;
  }

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { agentLogs } = taskLogs || {};

  return (
    <LogBody
      data={agentLogs || []}
      error={error}
      loading={loading}
      {...props}
    />
  );
};

export const TaskLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const {
    data,
    dataState,
    error,
    loading,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<TaskLogsQuery, TaskLogsQueryVariables>(TASK_LOGS, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "There was an error loading task logs");
  usePolling<TaskLogsQuery, TaskLogsQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  if (dataState !== "complete") {
    return null;
  }

  const { task } = data || {};
  const { taskLogs } = task || {};

  return (
    <LogBody
      data={taskLogs?.taskLogs || []}
      error={error}
      loading={loading}
      {...props}
    />
  );
};
