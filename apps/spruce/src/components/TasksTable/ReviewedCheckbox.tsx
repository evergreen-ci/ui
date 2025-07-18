import Checkbox from "@leafygreen-ui/checkbox";
import { LeafyGreenTableRow } from "@leafygreen-ui/table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useTaskReview } from "components/TaskReview/useTaskReview";
import { TaskQuery } from "gql/generated/types";
import { TaskTableInfo } from "./types";

export const ReviewedCheckbox: React.FC<{
  row: LeafyGreenTableRow<TaskTableInfo>;
}> = ({ row }) => {
  const { checked, task, updateDisplayTask, updateTask } = useTaskReview({
    taskId: row.original.id,
    execution: row.original.execution,
  });

  const someChecked = task?.executionTasksFull?.some(
    (t: NonNullable<TaskQuery["task"]>) => t.reviewed,
  );
  const allChecked = task?.executionTasksFull?.every(
    (t: NonNullable<TaskQuery["task"]>) =>
      t.displayStatus === TaskStatus.Succeeded || t.reviewed,
  );
  const indeterminate = someChecked && !allChecked;

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
