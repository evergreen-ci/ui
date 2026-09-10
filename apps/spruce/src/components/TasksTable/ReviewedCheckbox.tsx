import { LeafyGreenTableRow } from "@leafygreen-ui/table";
import { Checkbox } from "@via-ds/components/checkbox";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useTaskReview } from "components/TaskReview/useTaskReview";
import styles from "./ReviewedCheckbox.module.css";
import { TaskTableInfo } from "./types";

export const ReviewedCheckbox: React.FC<{
  row: LeafyGreenTableRow<TaskTableInfo>;
}> = ({ row }) => {
  const {
    allChecked,
    checked,
    someChecked,
    task,
    updateDisplayTask,
    updateTask,
  } = useTaskReview({
    taskId: row.original.id,
    execution: row.original.execution,
  });

  const indeterminate: boolean = someChecked && !allChecked;

  const handleClick = () => {
    if (row.subRows.length) {
      updateDisplayTask();
    } else {
      updateTask();
    }
  };

  return (
    <Checkbox
      aria-label={`Mark as ${checked ? "un" : ""}reviewed`}
      className={styles.checkbox}
      data-lgid={`lg-reviewed-${row.original.id}`}
      data-testid={`reviewed-${row.original.id}`}
      isDisabled={task.displayStatus === TaskStatus.Succeeded}
      isIndeterminate={indeterminate}
      isSelected={checked}
      onChange={handleClick}
    />
  );
};
