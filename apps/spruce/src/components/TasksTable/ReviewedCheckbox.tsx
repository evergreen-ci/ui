import { Checkbox } from "@leafygreen-ui/checkbox";
import { LeafyGreenTableRow } from "@leafygreen-ui/table";
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
      checked={checked}
      className={styles.checkbox}
      data-lgid={`lg-reviewed-${row.original.id}`}
      data-testid={`reviewed-${row.original.id}`}
      disabled={task.displayStatus === TaskStatus.Succeeded}
      indeterminate={indeterminate}
      onChange={handleClick}
    />
  );
};
