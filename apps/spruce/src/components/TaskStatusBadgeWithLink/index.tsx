import { palette } from "@leafygreen-ui/palette";
import OpenNewTab from "@via-ds/icons/OpenNewTab";
import { Link } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
import styles from "./index.module.css";

interface TaskStatusBadgeWithLinkProps extends React.ComponentProps<
  typeof TaskStatusBadge
> {
  id: string;
  execution: number;
  onClick?: () => void;
  tab?: TaskTab;
}

const TaskStatusBadgeWithLink: React.FC<TaskStatusBadgeWithLinkProps> = ({
  execution,
  id,
  onClick,
  status,
  tab,
  ...rest
}) => {
  let linkedTab;
  if (tab) {
    linkedTab = tab;
  } else if (status === TaskStatus.KnownIssue) {
    linkedTab = TaskTab.Annotations;
  }

  return (
    <Link
      className={styles.link}
      onClick={onClick}
      to={getTaskRoute(id, {
        execution,
        tab: linkedTab,
      })}
    >
      <TaskStatusBadge status={status as TaskStatus} {...rest} />
      <OpenNewTab className="link-icon" fill={palette.blue.base} />
    </Link>
  );
};

export default TaskStatusBadgeWithLink;
