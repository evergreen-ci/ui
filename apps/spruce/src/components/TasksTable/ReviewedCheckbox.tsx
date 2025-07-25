import Checkbox from "@leafygreen-ui/checkbox";
import { LeafyGreenTableRow } from "@leafygreen-ui/table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useTaskReview } from "components/TaskReview/useTaskReview";
import { TaskTableInfo } from "./types";

export const ReviewedCheckbox: React.FC<{
  row: LeafyGreenTableRow<TaskTableInfo>;
}> = ({ row }) => {
  const { checked, task, updateDisplayTask, updateTask } = useTaskReview({
    taskId: row.original.id,
    execution: row.original.execution,
  });

  const someChecked: boolean =
    task?.executionTasksFull?.some((t) => t?.reviewed) ?? false;
  const allChecked: boolean =
    task?.executionTasksFull?.every(
      (t) => t?.displayStatus === TaskStatus.Succeeded || t?.reviewed,
    ) ?? false;
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
      data-lgid={`lg-reviewed-${row.original.id}`}
      disabled={task.displayStatus === TaskStatus.Succeeded}
      indeterminate={indeterminate}
      onChange={handleClick}
    />
  );
};
