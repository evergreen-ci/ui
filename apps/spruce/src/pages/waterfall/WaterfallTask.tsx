import { memo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { useOnClickOutside } from "@evg-ui/lib/hooks/useOnClickOutside";
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
}> = ({ isFirstActiveTask, isRightmostBuild, task }) => {
  const taskBoxRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const squareProps = isFirstActiveTask
    ? { [waterfallGuideId]: walkthroughSteps[0].targetId }
    : {};

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // Open the popup on Alt + Click.
    if (e.altKey) {
      e.preventDefault();
      setOpen((prevOpen) => !prevOpen);
    }
  };

  const { displayName, displayStatusCache, execution, id: taskId } = task;
  const taskStatus = displayStatusCache as TaskStatus;

  useOnClickOutside([taskBoxRef, popoverRef], () => setOpen(false));

  return (
    <>
      <TaskBoxMemo
        key={taskId}
        ref={taskBoxRef}
        as={Link}
        data-tooltip={`${displayName} - ${taskStatusToCopy[taskStatus]}`}
        onClick={handleClick}
        rightmost={isRightmostBuild}
        status={taskStatus}
        to={getTaskRoute(taskId, { execution })}
        tooltip={`${displayName} - ${taskStatusToCopy[taskStatus]}`}
        {...squareProps}
      />
      <TaskOverviewPopup
        ref={popoverRef}
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
