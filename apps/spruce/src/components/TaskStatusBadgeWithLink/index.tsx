import { Link } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";

interface TaskStatusBadgeWithLinkProps {
  status: string;
  id: string;
  execution: number;
}
const TaskStatusBadgeWithLink: React.FC<TaskStatusBadgeWithLinkProps> = ({
  execution,
  id,
  status,
}) => (
  <Link
    to={getTaskRoute(id, {
      execution,
      tab: status === TaskStatus.KnownIssue ? TaskTab.Annotations : undefined,
    })}
  >
    <TaskStatusBadge status={status} />
  </Link>
);

export default TaskStatusBadgeWithLink;
