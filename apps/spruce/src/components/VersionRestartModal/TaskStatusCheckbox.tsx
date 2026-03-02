import { memo } from "react";
import styled from "@emotion/styled";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskBox as BaseTaskBox } from "components/TaskBox";

const CHECKBOX_SQUARE_SIZE = 14;
const CHECKBOX_SQUARE_BORDER = 1;

interface TaskStatusCheckboxProps {
  baseStatus?: string;
  checked: boolean;
  displayName: string;
  onClick: () => void;
  status: string;
  taskId: string;
}

const CheckboxComponent: React.FC<TaskStatusCheckboxProps> = ({
  baseStatus,
  checked,
  displayName,
  onClick,
  status,
  taskId,
}) => (
  <Checkbox
    bold={false}
    checked={checked}
    data-cy="task-status-checkbox"
    label={
      <StateItemWrapper>
        <TaskBox
          squareSize={CHECKBOX_SQUARE_SIZE}
          status={status as TaskStatus}
        />
        {baseStatus ? (
          <TaskBox
            squareSize={CHECKBOX_SQUARE_SIZE}
            status={baseStatus as TaskStatus}
          />
        ) : (
          <EmptyCell />
        )}
        <div>{displayName}</div>
      </StateItemWrapper>
    }
    name={taskId}
    onClick={onClick}
  />
);

export const TaskStatusCheckbox = memo(CheckboxComponent);

const StateItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${size.xxs};
  white-space: nowrap;
`;

const TaskBox = styled(BaseTaskBox)`
  float: none;
  flex-shrink: 0;
`;

const EmptyCell = styled.span`
  width: ${CHECKBOX_SQUARE_SIZE + CHECKBOX_SQUARE_BORDER * 2}px;
  flex-shrink: 0;
`;
