import { Badge, Variant } from "@leafygreen-ui/badge";
import { taskStatusToCopy } from "../../../constants/task";
import { TaskStatus, TaskStatusUmbrella } from "../../../types/task";
import { cx } from "../../../utils/css";
import styles from "./index.module.css";

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
    <Badge
      key={status}
      className={cx(styles.badge, customBadgeColorClass(status))}
      data-testid="task-status-badge"
      variant={mapTaskStatusToBadgeVariant[status]}
    >
      {badgeCopy}
    </Badge>
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
  [TaskStatus.SetupFailed]: Variant.Blue,
};
// only use for statuses whose color is not supported by leafygreen badge variants
const customBadgeColorClass = (status: string) => {
  switch (status) {
    case TaskStatus.SystemFailed:
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
      return styles.systemFailed;
    case TaskStatus.KnownIssue:
      return styles.knownIssue;
    default:
      return undefined;
  }
};

export default TaskStatusBadge;
