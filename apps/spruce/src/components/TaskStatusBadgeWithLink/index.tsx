import { Link } from "react-router-dom";
import { TaskStatusBadge } from "@evg-ui/lib/components";
import { TaskStatus } from "@evg-ui/lib/types";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";

interface TaskStatusBadgeWithLinkProps extends React.ComponentProps<
  typeof TaskStatusBadge
> {
  id: string;
  execution: number;
}
const TaskStatusBadgeWithLink: React.FC<TaskStatusBadgeWithLinkProps> = ({
  execution,
  id,
  status,
  ...rest
}) => (
  <Link
    to={getTaskRoute(id, {
      execution,
      tab: status === TaskStatus.KnownIssue ? TaskTab.Annotations : undefined,
    })}
  >
    <TaskStatusBadge status={status as TaskStatus} {...rest} />
  </Link>
);

export default TaskStatusBadgeWithLink;
