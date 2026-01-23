import { IconProps } from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import Icon from "@evg-ui/lib/components/Icon";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { TaskBox } from "components/TaskBox";

const { gray, green, purple, red, yellow } = palette;

export interface TaskStatusIconProps extends Omit<
  IconProps,
  "glyph" | "fill" | "size"
> {
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
      return <Icon fill={red.base} glyph="Failure" size={size} {...rest} />;
    case TaskStatus.KnownIssue:
      return (
        <Icon fill={red.base} glyph="OldKnownFailure" size={size} {...rest} />
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

export const waterfallGroupedStatuses = [
  {
    icon: <TaskBox status={TaskStatus.Succeeded} />,
    statuses: [TaskStatus.Succeeded],
  },
  {
    icon: <TaskBox status={TaskStatus.Started} />,
    statuses: [TaskStatus.Started, TaskStatus.Dispatched],
  },
  {
    icon: <TaskBox status={TaskStatus.SystemFailed} />,
    statuses: [
      TaskStatus.SystemFailed,
      TaskStatus.SystemTimedOut,
      TaskStatus.SystemUnresponsive,
    ],
  },
  {
    icon: <TaskBox status={TaskStatus.Failed} />,
    statuses: [TaskStatus.Failed],
  },
  {
    icon: <TaskBox status={TaskStatus.KnownIssue} />,
    statuses: [TaskStatus.KnownIssue],
  },
  {
    icon: <TaskBox status={TaskStatus.TaskTimedOut} />,
    statuses: [TaskStatus.TaskTimedOut, TaskStatus.TestTimedOut],
  },
  {
    icon: <TaskBox status={TaskStatus.SetupFailed} />,
    statuses: [TaskStatus.SetupFailed],
  },
  {
    icon: <TaskBox status={TaskStatus.Unscheduled} />,
    statuses: [TaskStatus.Unscheduled, TaskStatus.Aborted, TaskStatus.Blocked],
  },
  {
    icon: <TaskBox status={TaskStatus.Undispatched} />,
    statuses: [TaskStatus.Undispatched, TaskStatus.WillRun],
  },
];
