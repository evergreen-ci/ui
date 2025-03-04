import styled from "@emotion/styled";
import { IconProps } from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import Icon from "@evg-ui/lib/components/Icon";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { SQUARE_SIZE, taskStatusStyleMap } from "pages/waterfall/styles";
import { reportError } from "utils/errorReporting";

const { gray, green, purple, red, white, yellow } = palette;

export interface TaskStatusIconProps
  extends Omit<IconProps, "glyph" | "fill" | "size"> {
  status: string;
  size?: number;
}

export const TaskStatusIcon: React.FC<TaskStatusIconProps> = ({
  size = 16,
  status,
  ...rest
}) => {
  switch (status) {
    case TaskStatus.Succeeded:
      return (
        <Icon fill={green.dark1} glyph="Checkmark" size={size} {...rest} />
      );
    case TaskStatus.Failed:
      return <Icon fill={red.base} glyph="FailureIcon" size={size} {...rest} />;
    case TaskStatus.KnownIssue:
      return (
        <Icon fill={red.base} glyph="KnownFailureIcon" size={size} {...rest} />
      );
    case TaskStatus.Dispatched:
    case TaskStatus.Started:
      return <Icon fill={yellow.dark2} glyph="Refresh" size={size} {...rest} />;
    case TaskStatus.SetupFailed:
      return (
        <Icon fill={purple.dark2} glyph="SetupFailure" size={size} {...rest} />
      );
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
    case TaskStatus.SystemFailed:
      return (
        <Icon fill={purple.dark2} glyph="SystemFailure" size={size} {...rest} />
      );
    case TaskStatus.TestTimedOut:
    case TaskStatus.TaskTimedOut:
      return <Icon fill={red.base} glyph="TimedOut" size={size} {...rest} />;
    case TaskStatus.Aborted:
    case TaskStatus.Blocked:
    case TaskStatus.Unscheduled:
    case TaskStatus.Inactive:
    case TaskStatus.Undispatched:
      return (
        <Icon fill={gray.dark1} glyph="WillNotRun" size={size} {...rest} />
      );
    case TaskStatus.WillRun:
    case TaskStatus.Pending:
    case TaskStatus.Unstarted:
      return <Icon fill={gray.dark3} glyph="Calendar" size={size} {...rest} />;
    default:
      reportError(
        new Error(`Status '${status}' is not a valid task status`),
      ).warning();
      return null;
  }
};

export const mainlineCommitsGroupedStatuses = [
  {
    icon: <TaskStatusIcon status={TaskStatus.Succeeded} />,
    statuses: [TaskStatus.Succeeded],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.Failed} />,
    statuses: [TaskStatus.Failed],
  },

  {
    icon: <TaskStatusIcon status={TaskStatus.KnownIssue} />,
    statuses: [TaskStatus.KnownIssue],
  },

  {
    icon: <TaskStatusIcon status={TaskStatus.SetupFailed} />,
    statuses: [TaskStatus.SetupFailed],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.TestTimedOut} />,
    statuses: [TaskStatus.TestTimedOut, TaskStatus.TaskTimedOut],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.Dispatched} />,
    statuses: [TaskStatus.Dispatched, TaskStatus.Started],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.WillRun} />,
    statuses: [TaskStatus.WillRun, TaskStatus.Pending, TaskStatus.Unstarted],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.SystemUnresponsive} />,
    statuses: [
      TaskStatus.SystemUnresponsive,
      TaskStatus.SystemTimedOut,
      TaskStatus.SystemFailed,
    ],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.Aborted} />,
    statuses: [
      TaskStatus.Aborted,
      TaskStatus.Blocked,
      TaskStatus.Unscheduled,
      TaskStatus.Inactive,
      TaskStatus.Undispatched,
    ],
  },
];

export const Square = styled.div<{
  status: TaskStatus;
}>`
  width: ${SQUARE_SIZE}px;
  height: ${SQUARE_SIZE}px;
  border: 1px solid ${white};
  box-sizing: content-box;
  ${({ status }) => taskStatusStyleMap[status]}
`;

export const waterfallGroupedStatuses = [
  {
    icon: <Square status={TaskStatus.Succeeded} />,
    statuses: [TaskStatus.Succeeded],
  },
  {
    icon: <Square status={TaskStatus.Started} />,
    statuses: [TaskStatus.Started, TaskStatus.Dispatched],
  },
  {
    icon: <Square status={TaskStatus.SystemFailed} />,
    statuses: [
      TaskStatus.SystemFailed,
      TaskStatus.SystemTimedOut,
      TaskStatus.SystemUnresponsive,
    ],
  },
  {
    icon: <Square status={TaskStatus.Failed} />,
    statuses: [TaskStatus.Failed],
  },
  {
    icon: <Square status={TaskStatus.KnownIssue} />,
    statuses: [TaskStatus.KnownIssue],
  },
  {
    icon: <Square status={TaskStatus.TaskTimedOut} />,
    statuses: [TaskStatus.TaskTimedOut, TaskStatus.TestTimedOut],
  },
  {
    icon: <Square status={TaskStatus.SetupFailed} />,
    statuses: [TaskStatus.SetupFailed],
  },
  {
    icon: <Square status={TaskStatus.Unscheduled} />,
    statuses: [TaskStatus.Unscheduled, TaskStatus.Aborted, TaskStatus.Blocked],
  },
  {
    icon: <Square status={TaskStatus.Undispatched} />,
    statuses: [TaskStatus.Undispatched, TaskStatus.WillRun],
  },
];
