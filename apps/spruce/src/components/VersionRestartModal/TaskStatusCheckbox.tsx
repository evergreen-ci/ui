import { memo } from "react";
import styled from "@emotion/styled";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { size } from "@evg-ui/lib/constants";
import { TaskStatusIcon } from "components/TaskStatusIcon";

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
        <TaskStatusIcon status={status} />
        {baseStatus ? <TaskStatusIcon status={baseStatus} /> : <EmptyCell />}
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

const EmptyCell = styled.span`
  width: ${size.s};
`;
