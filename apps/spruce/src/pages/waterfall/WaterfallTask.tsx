import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskBox } from "components/TaskBox";
import { getTaskRoute } from "constants/routes";
import { walkthroughSteps, waterfallGuideId } from "./constants";
import { TaskOverviewPopup } from "./TaskOverviewPopup";
import { Build } from "./types";

export const WaterfallTask: React.FC<{
  handleTaskClick: (taskId: string, e: React.MouseEvent<HTMLElement>) => void;
  isFirstActiveTask: boolean;
  isRightmostBuild: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  task: Unpacked<Build["tasks"]>;
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
      {open && (
        <TaskOverviewPopup
          execution={execution}
          open={open}
          setOpen={setOpen}
          taskBoxRef={taskBoxRef}
          taskId={taskId}
        />
      )}
    </>
  );
};

const TaskBoxMemo = memo(TaskBox);
