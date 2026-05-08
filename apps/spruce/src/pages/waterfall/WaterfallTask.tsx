import { memo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { taskBoxStyles } from "components/TaskBox";
import { getTaskRoute } from "constants/routes";
import { walkthroughSteps, waterfallGuideId } from "./constants";
import { TaskOverviewPopup } from "./TaskOverviewPopup";
import { Build } from "./types";

const WaterfallTaskInner: React.FC<{
  handleTaskClick: (taskId: string, e: React.MouseEvent<HTMLElement>) => void;
  isFirstActiveTask: boolean;
  isRightmostBuild: boolean;
  open: boolean;
  setOpenTaskId: (taskId: string | null) => void;
  task: Unpacked<Build["tasks"]>;
}> = ({
  handleTaskClick,
  isFirstActiveTask,
  isRightmostBuild,
  open,
  setOpenTaskId,
  task,
}) => {
  const taskBoxRef = useRef<HTMLAnchorElement>(null);
  const squareProps = isFirstActiveTask
    ? { [waterfallGuideId]: walkthroughSteps[0].targetId }
    : {};

  const { displayName, displayStatusCache, execution, id: taskId } = task;
  const taskStatus = displayStatusCache as TaskStatus;

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => handleTaskClick(taskId, e),
    [handleTaskClick, taskId],
  );

  const setOpen = useCallback(
    (isOpen: boolean) => setOpenTaskId(isOpen ? taskId : null),
    [setOpenTaskId, taskId],
  );

  return (
    <>
      <Link
        key={taskId}
        ref={taskBoxRef}
        css={taskBoxStyles}
        data-status={taskStatus}
        data-tooltip={`${displayName} - ${taskStatusToCopy[taskStatus]}`}
        onClick={onClick}
        to={getTaskRoute(taskId, { execution })}
        {...squareProps}
      />
      {open && (
        <TaskOverviewPopup
          execution={execution}
          isRightmostBuild={isRightmostBuild}
          open={open}
          setOpen={setOpen}
          taskBoxRef={taskBoxRef}
          taskId={taskId}
        />
      )}
    </>
  );
};

export const WaterfallTask = memo(
  WaterfallTaskInner,
  (prev, next) =>
    prev.task.id === next.task.id &&
    prev.task.displayStatusCache === next.task.displayStatusCache &&
    prev.task.execution === next.task.execution &&
    prev.task.displayName === next.task.displayName &&
    prev.isFirstActiveTask === next.isFirstActiveTask &&
    prev.isRightmostBuild === next.isRightmostBuild &&
    prev.open === next.open,
);
