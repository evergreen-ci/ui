import { memo } from "react";
import { Checkbox } from "@via-ds/components";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskBox } from "components/TaskBox";
import styles from "./TaskStatusCheckbox.module.css";

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
    data-testid="task-status-checkbox"
    isSelected={checked}
    name={taskId}
    onChange={onClick}
  >
    <div className={styles.stateItemWrapper}>
      <TaskBox className={styles.taskBox} status={status as TaskStatus} />
      {baseStatus ? (
        <TaskBox className={styles.taskBox} status={baseStatus as TaskStatus} />
      ) : (
        <span className={styles.emptyCell} />
      )}
      <div>{displayName}</div>
    </div>
  </Checkbox>
);

export const TaskStatusCheckbox = memo(CheckboxComponent);
