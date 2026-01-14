import styled from "@emotion/styled";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { ShortenedRouterLink } from "components/styles";
import { getHostRoute, getPodRoute, getTaskRoute } from "constants/routes";
import { TaskEventLogEntry } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { TaskEventType } from "types/task";

export const TaskEventLogLine: React.FC<TaskEventLogEntry> = ({
  data,
  eventType,
  timestamp,
}) => {
  const getDateCopy = useDateFormat();
  const {
    blockedOn,
    hostId,
    jiraIssue,
    jiraLink,
    podId,
    priority,
    status,
    userId,
  } = data;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const route = podId ? getPodRoute(podId) : getHostRoute(hostId);
  const containerOrHostCopy = podId ? "container" : "host";
  let message: React.JSX.Element;
  switch (eventType) {
    case TaskEventType.TaskBlocked:
      message = (
        <>
          Task is blocked on{" "}
          <ShortenedRouterLink
            baseWidth={500}
            title={blockedOn ?? ""}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            to={getTaskRoute(blockedOn)}
          >
            {blockedOn}
          </ShortenedRouterLink>
          .
        </>
      );
      break;
    case TaskEventType.TaskFinished:
      message = (
        <>
          Completed with status: <b>{status}</b>
        </>
      );
      break;
    case TaskEventType.TaskStarted:
      message = <>Marked as &quot;started&quot;</>;
      break;
    case TaskEventType.TaskDispatched:
      message = (
        <>
          Dispatched to {containerOrHostCopy}{" "}
          <StyledRouterLink to={route}>{hostId}</StyledRouterLink>
        </>
      );
      break;
    case TaskEventType.TaskUndispatched:
      message = (
        <>
          Undispatched from {containerOrHostCopy}{" "}
          <StyledRouterLink to={route}>{hostId}</StyledRouterLink>
        </>
      );
      break;
    case TaskEventType.TaskCreated:
      message = <>Task created</>;
      break;
    case TaskEventType.TaskRestarted:
      message = <>Restarted by {userId}</>;
      break;
    case TaskEventType.TaskActivated:
      message = <>Activated by {userId}</>;
      break;
    case TaskEventType.TaskJiraAlertCreated:
      message = (
        <>
          Created Jira Alert{" "}
          <StyledLink href={jiraLink ?? ""}>
            <strong>{jiraIssue}</strong>
          </StyledLink>
        </>
      );
      break;
    case TaskEventType.TaskDeactivated:
      message = <>Deactivated by user {userId}</>;
      break;
    case TaskEventType.TaskAbortRequest:
      message = <>Marked to abort by user {userId}</>;
      break;
    case TaskEventType.TaskScheduled:
      message = (
        <span className="cy-event-scheduled">
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          Scheduled at {getDateCopy(timestamp)}
        </span>
      );
      break;
    case TaskEventType.TaskPriorityChanged:
      message = (
        <>
          Priority Changed to {priority} by {userId}
        </>
      );
      break;
    case TaskEventType.TaskDependenciesOverridden:
      message = <>Dependencies overridden by user {userId}.</>;
      break;
    case TaskEventType.MergeTaskUnscheduled:
      message = <>Merge task unscheduled by user {userId}.</>;
      break;
    case TaskEventType.ContainerAllocated:
      message = <>Container allocated for task.</>;
      break;
    default:
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      message = null;
  }

  return (
    <Row>
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      <Timestamp className="cy-event-ts">{getDateCopy(timestamp)}</Timestamp>
      {message}
    </Row>
  );
};

const Row = styled.div`
  font-size: 16px;
  padding-top: ${size.xs};
  margin-bottom: ${size.xs};
  border-top: 1px dotted #ccc;
`;

const Timestamp = styled.span`
  margin-right: ${size.s};
`;
