import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { taskStatusToCopy } from "../../../constants/task";
import { TaskStatus, TaskStatusUmbrella } from "../../../types/task";

const { purple, red, white } = palette;

interface BadgeColorProps {
  border?: string;
  fill?: string;
  text?: string;
}

const badgeWidthMaxContent = css`
  width: max-content;
`;

// only use for statuses whose color is not supported by leafygreen badge variants, i.e. SystemFailed, TestTimedOut, SetupFailed
const StyledBadge = styled(Badge)<BadgeColorProps>`
  ${({ border }) => border && `border-color: ${border} !important;`}
  ${({ fill }) => fill && `background-color: ${fill} !important;`}
  ${({ text }) => text && `color: ${text} !important;`}
  ${badgeWidthMaxContent}
`;

interface TaskStatusBadgeProps {
  taskCount?: number;
  status: TaskStatus | TaskStatusUmbrella | undefined;
}
const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  taskCount,
}) => {
  if (!status) {
    return null;
  }

  const statusText = taskStatusToCopy[status] ?? status;

  const badgeCopy =
    taskCount === undefined ? statusText : `${taskCount} ${statusText}`;
  return (
    <StyledBadge
      key={status}
      data-cy="task-status-badge"
      variant={mapTaskStatusToBadgeVariant[status]}
      {...customBadgeColors(status)}
    >
      {badgeCopy}
    </StyledBadge>
  );
};

const mapTaskStatusToBadgeVariant: Record<string, Variant> = {
  [TaskStatus.Inactive]: Variant.LightGray,
  [TaskStatus.Unstarted]: Variant.LightGray,
  [TaskStatus.Undispatched]: Variant.LightGray,
  [TaskStatus.Blocked]: Variant.LightGray,
  [TaskStatus.Pending]: Variant.LightGray,
  [TaskStatus.Unscheduled]: Variant.LightGray,
  [TaskStatus.Aborted]: Variant.LightGray,
  [TaskStatus.Started]: Variant.Yellow,
  [TaskStatus.Dispatched]: Variant.Yellow,
  [TaskStatus.Failed]: Variant.Red,
  [TaskStatus.TestTimedOut]: Variant.Red,
  [TaskStatus.TaskTimedOut]: Variant.Red,
  [TaskStatus.Succeeded]: Variant.Green,
  [TaskStatus.WillRun]: Variant.DarkGray,
};
const customBadgeColors = (status: string) => {
  switch (status) {
    case TaskStatus.SetupFailed:
      return {
        border: purple.base,
        fill: purple.light2,
        text: purple.dark2,
      };
    case TaskStatus.SystemFailed:
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
      return {
        border: purple.dark3,
        fill: purple.dark2,
        text: purple.light3,
      };
    case TaskStatus.KnownIssue:
      return {
        border: red.light2,
        fill: white,
        text: red.dark2,
      };
    default:
      return {};
  }
};

export default TaskStatusBadge;
