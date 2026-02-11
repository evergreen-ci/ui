import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskBox } from "components/TaskBox";
import { TaskOverviewPopup } from "components/TaskOverviewPopup";
import { getTaskRoute } from "constants/routes";
import { walkthroughSteps, waterfallGuideId } from "./constants";
import { Build } from "./types";

export const WaterfallTask: React.FC<{
  task: Unpacked<Build["tasks"]>;
  isRightmostBuild: boolean;
  isFirstActiveTask: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleTaskClick: (taskId: string, e: React.MouseEvent<HTMLElement>) => void;
}> = ({
  handleTaskClick,
  isFirstActiveTask,
  isRightmostBuild,
  open,
  setOpen,
  task,
}) => {
  const taskBoxRef = useRef<HTMLDivElement>(null);

  const squareProps = isFirstActiveTask
    ? { [waterfallGuideId]: walkthroughSteps[0].targetId }
    : {};

  const { displayName, displayStatusCache, execution, id: taskId } = task;
  const taskStatus = displayStatusCache as TaskStatus;

  return (
    <>
      <TaskBoxMemo
        key={taskId}
        ref={taskBoxRef}
        as={Link}
        data-tooltip={`${displayName} - ${taskStatusToCopy[taskStatus]}`}
        onClick={(e: React.MouseEvent<HTMLElement>) =>
          handleTaskClick(taskId, e)
        }
        rightmost={isRightmostBuild}
        status={taskStatus}
        to={getTaskRoute(taskId, { execution })}
        tooltip={`${displayName} - ${taskStatusToCopy[taskStatus]}`}
        {...squareProps}
      />
      <TaskOverviewPopup
        execution={execution}
        open={open}
        setOpen={setOpen}
        taskBoxRef={taskBoxRef}
        taskId={taskId}
      />
    </>
  );
};

const TaskBoxMemo = memo(TaskBox);
