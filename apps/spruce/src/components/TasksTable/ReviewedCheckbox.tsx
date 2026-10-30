import { LeafyGreenTableRow } from "@leafygreen-ui/table";
import { Toggle, Size as ToggleSize } from "@leafygreen-ui/toggle";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useTaskReview } from "components/TaskReview/useTaskReview";
import styles from "./ReviewedCheckbox.module.css";
import { TaskTableInfo } from "./types";

export const ReviewedCheckbox: React.FC<{
  row: LeafyGreenTableRow<TaskTableInfo>;
}> = ({ row }) => {
  const { checked, task, updateDisplayTask, updateTask } = useTaskReview({
    taskId: row.original.id,
    execution: row.original.execution,
  });

  const handleClick = () => {
    if (row.subRows.length) {
      updateDisplayTask();
    } else {
      updateTask();
    }
  };

  return (
    <Toggle
      aria-label={`Mark as ${checked ? "un" : ""}reviewed`}
      checked={checked}
      className={styles.toggle}
      data-lgid={`lg-reviewed-${row.original.id}`}
      data-testid={`reviewed-${row.original.id}`}
      disabled={task.displayStatus === TaskStatus.Succeeded}
      onChange={handleClick}
      size={ToggleSize.XSmall}
      style={{ flexShrink: 0 }}
    />
  );
};
