import { Badge, BadgeVariant } from "@via-ds/components/badge";
import { taskStatusToCopy } from "../../../constants/task";
import { TaskStatus, TaskStatusUmbrella } from "../../../types/task";
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
      className={styles.badge}
      data-testid="task-status-badge"
      variant={mapTaskStatusToBadgeVariant[status]}
    >
      {badgeCopy}
    </Badge>
  );
};

const mapTaskStatusToBadgeVariant: Record<string, BadgeVariant> = {
  [TaskStatus.Inactive]: BadgeVariant.Status,
  [TaskStatus.Unstarted]: BadgeVariant.Status,
  [TaskStatus.Undispatched]: BadgeVariant.Status,
  [TaskStatus.Blocked]: BadgeVariant.Status,
  [TaskStatus.Pending]: BadgeVariant.Status,
  [TaskStatus.Unscheduled]: BadgeVariant.Status,
  [TaskStatus.Aborted]: BadgeVariant.Status,
  [TaskStatus.Started]: BadgeVariant.Warning,
  [TaskStatus.Dispatched]: BadgeVariant.Warning,
  [TaskStatus.Failed]: BadgeVariant.Error,
  [TaskStatus.TestTimedOut]: BadgeVariant.Error,
  [TaskStatus.TaskTimedOut]: BadgeVariant.Error,
  [TaskStatus.SystemFailed]: BadgeVariant.Error,
  [TaskStatus.SystemUnresponsive]: BadgeVariant.Error,
  [TaskStatus.SystemTimedOut]: BadgeVariant.Error,
  [TaskStatus.KnownIssue]: BadgeVariant.Error,
  [TaskStatus.Succeeded]: BadgeVariant.Success,
  [TaskStatus.WillRun]: BadgeVariant.Status,
  [TaskStatus.SetupFailed]: BadgeVariant.Info,
};

export default TaskStatusBadge;
