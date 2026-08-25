import { Tooltip } from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { mapUmbrellaStatusColors } from "constants/task";
import styles from "./index.module.css";

interface GroupedTaskStatusBadgeProps {
  count: number;
  onClick?: () => void;
  status: keyof typeof mapUmbrellaStatusColors;
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
}) => {
  const { border, fill, text } = mapUmbrellaStatusColors[status];

  return (
    <Tooltip
      align="top"
      darkMode
      enabled={!!statusCounts}
      justify="middle"
      trigger={
        <div>
          <Link
            aria-selected={isActive}
            data-testid="grouped-task-status-badge"
            onClick={() => onClick()}
            to={href}
          >
            <div
              className={styles.badgeContainer}
              style={{
                borderColor: border,
                backgroundColor: fill,
                color: text,
                opacity: isActive === false ? 0.4 : undefined,
              }}
            >
              <span className={styles.number}>{count}</span>
              <span className={styles.status}>
                {taskStatusToCopy[status as TaskStatus]}
              </span>
            </div>
          </Link>
        </div>
      }
      triggerEvent="hover"
    >
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
  );
};
