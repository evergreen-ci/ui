import { Button, Size } from "@leafygreen-ui/button";
import Cookies from "js-cookie";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useTaskReview } from "components/TaskReview/useTaskReview";
import { DISABLE_TASK_REVIEW } from "constants/cookies";

export const MarkReviewed: React.FC<{
  taskId: string;
  execution: number;
}> = ({ execution, taskId }) => {
  const { checked, task, updateDisplayTask, updateTask } = useTaskReview({
    taskId: taskId ?? "",
    execution: execution ?? 0,
  });

  const handleClick = () => {
    if (task?.executionTasksFull?.length) {
      updateDisplayTask();
    } else {
      updateTask();
    }
  };

  const taskReviewEnabled = Cookies.get(DISABLE_TASK_REVIEW) !== "true";

  return taskReviewEnabled ? (
    <Button
      disabled={task.displayStatus === TaskStatus.Succeeded}
      onClick={handleClick}
      size={Size.Small}
    >
      {checked ? "Mark unreviewed" : "Mark reviewed"}
    </Button>
  ) : null;
};
