import { memo } from "react";
import { Checkbox } from "@leafygreen-ui/checkbox";
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
    bold={false}
    checked={checked}
    data-testid="task-status-checkbox"
    label={
      <div className={styles.stateItemWrapper}>
        <TaskBox className={styles.taskBox} status={status as TaskStatus} />
        {baseStatus ? (
          <TaskBox
            className={styles.taskBox}
            status={baseStatus as TaskStatus}
          />
        ) : (
          <span className={styles.emptyCell} />
        )}
        <div>{displayName}</div>
      </div>
    }
    name={taskId}
    onClick={onClick}
  />
);

export const TaskStatusCheckbox = memo(CheckboxComponent);
