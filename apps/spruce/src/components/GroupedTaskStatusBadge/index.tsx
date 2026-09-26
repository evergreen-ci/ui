import { Tooltip, TooltipRoot, TooltipTrigger } from "@via-ds/components";
import { Link } from "react-router-dom";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus, TaskStatusUmbrella } from "@evg-ui/lib/types/task";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./index.module.css";

export type GroupedTaskStatus =
  | TaskStatusUmbrella
  | TaskStatus.Succeeded
  | TaskStatus.SetupFailed;

const statusClass: Record<GroupedTaskStatus, string> = {
  [TaskStatusUmbrella.Undispatched]: styles.undispatched,
  [TaskStatusUmbrella.Running]: styles.running,
  [TaskStatusUmbrella.SystemFailure]: styles.systemFailure,
  [TaskStatusUmbrella.Scheduled]: styles.scheduled,
  [TaskStatusUmbrella.Failed]: styles.failed,
  [TaskStatus.Succeeded]: styles.succeeded,
  [TaskStatus.SetupFailed]: styles.setupFailed,
};

interface GroupedTaskStatusBadgeProps {
  count: number;
  onClick?: () => void;
  status: GroupedTaskStatus;
  statusCounts?: { [key: string]: number };
  href: string;
  isActive?: boolean;
}

export const GroupedTaskStatusBadge: React.FC<GroupedTaskStatusBadgeProps> = ({
  count,
  href,
  isActive,
  onClick = () => undefined,
  status,
  statusCounts,
}) => (
  <TooltipRoot align="center" isDisabled={!statusCounts} side="top">
    <TooltipTrigger>
      <Link
        aria-selected={isActive}
        className={styles.tooltipTrigger}
        data-testid="grouped-task-status-badge"
        onClick={() => onClick()}
        to={href}
      >
        <div
          className={cx(styles.badgeContainer, statusClass[status])}
          style={{ opacity: isActive === false ? 0.4 : undefined }}
        >
          <span className={styles.number}>{count}</span>
          <span className={styles.status}>
            {taskStatusToCopy[status as TaskStatus]}
          </span>
        </div>
      </Link>
    </TooltipTrigger>
    <Tooltip>
      <div data-testid="grouped-task-status-badge-tooltip">
        {statusCounts &&
          Object.entries(statusCounts).map(([taskStatus, taskCount]) => (
            <div key={taskStatus} className={styles.row}>
              <span className={styles.count}>{taskCount}</span>{" "}
              {taskStatusToCopy[taskStatus as TaskStatus] ?? taskStatus}
            </div>
          ))}
      </div>
    </Tooltip>
  </TooltipRoot>
);
