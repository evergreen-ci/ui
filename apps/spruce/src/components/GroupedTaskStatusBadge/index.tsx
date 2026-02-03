import styled from "@emotion/styled";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { taskStatusToCopy, fontSize, size } from "@evg-ui/lib/constants";
import { TaskStatus } from "@evg-ui/lib/types";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { mapUmbrellaStatusColors } from "constants/task";

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
            data-cy="grouped-task-status-badge"
            onClick={() => onClick()}
            to={href}
          >
            <BadgeContainer
              border={border}
              fill={fill}
              isActive={isActive}
              text={text}
            >
              <Number>{count}</Number>
              <Status>{taskStatusToCopy[status as TaskStatus]}</Status>
            </BadgeContainer>
          </Link>
        </div>
      }
      triggerEvent="hover"
    >
      <div data-cy="grouped-task-status-badge-tooltip">
        {statusCounts &&
          Object.entries(statusCounts).map(([taskStatus, taskCount]) => (
            <Row key={taskStatus}>
              <TaskStatusIcon size={16} status={taskStatus} />
              <span>
                <Count>{taskCount}</Count>{" "}
                {taskStatusToCopy[taskStatus as TaskStatus] ?? taskStatus}
              </span>
            </Row>
          ))}
      </div>
    </Tooltip>
  );
};

interface BadgeColorProps {
  border?: string;
  fill?: string;
  text?: string;
  isActive?: boolean;
}

const BadgeContainer = styled.div<BadgeColorProps>`
  height: ${size.l};
  width: ${size.xl};
  border-radius: ${size.xxs};
  border: 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  line-height: normal;
  ${({ border }) => border && `border-color: ${border};`}
  ${({ fill }) => fill && `background-color: ${fill};`}
  ${({ text }) => text && `color: ${text};`}
  ${({ isActive }) => isActive === false && `opacity: 0.4`}
`;

const Row = styled.div`
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const Number = styled.span`
  font-size: ${fontSize.m};
  font-weight: bold;
  line-height: ${fontSize.m};
`;

const Status = styled.span`
  font-size: ${size.xs};
  white-space: nowrap;
`;

const Count = styled.span`
  font-weight: bold;
`;
