import styled from "@emotion/styled";
import { Icon } from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
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
    <StyledLink
      to={getTaskRoute(id, {
        execution,
        tab: linkedTab,
      })}
    >
      <TaskStatusBadge status={status as TaskStatus} {...rest} />
      <Icon className="link-icon" fill={palette.blue.base} glyph="OpenNewTab" />
    </StyledLink>
  );
};

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${size.xxs};
  text-decoration: none;

  .link-icon {
    opacity: 0;
    transition: opacity ${transitionDuration.default}ms ease-in;
    flex-shrink: 0;
  }
  :hover .link-icon {
    opacity: 1;
  }
`;

export default TaskStatusBadgeWithLink;
