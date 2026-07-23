import { Link } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";

interface TaskStatusBadgeWithLinkProps extends React.ComponentProps<
  typeof TaskStatusBadge
> {
  id: string;
  execution: number;
  tab?: TaskTab;
}

const TaskStatusBadgeWithLink: React.FC<TaskStatusBadgeWithLinkProps> = ({
  execution,
  id,
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
      to={getTaskRoute(id, {
        execution,
        tab: linkedTab,
      })}
    >
      <TaskStatusBadge status={status as TaskStatus} {...rest} />
    </Link>
  );
};

export default TaskStatusBadgeWithLink;
