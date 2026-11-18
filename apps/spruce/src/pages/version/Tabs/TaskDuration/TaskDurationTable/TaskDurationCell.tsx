import { msToDuration } from "utils/string";
import { DurationBar } from "./DurationBar";
import { TaskDurationDifference } from "./TaskDurationDifference";
import { TaskDurationData } from "./types";

interface TaskDurationCellProps {
  comparisonLabel: string;
  maxTimeTaken: number;
  task: TaskDurationData;
}

export const TaskDurationCell: React.FC<TaskDurationCellProps> = ({
  comparisonLabel,
  maxTimeTaken,
  task: { baseTask, displayStatus, finishTime, timeTaken },
}) => (
  <DurationBar
    label={
      <>
        <span>{msToDuration(timeTaken ?? 0)}</span>
        <TaskDurationDifference
          baseTask={baseTask}
          comparisonLabel={comparisonLabel}
          finishTime={finishTime}
          timeTaken={timeTaken}
        />
      </>
    }
    maxTimeTaken={maxTimeTaken}
    status={displayStatus}
    timeTaken={timeTaken ?? 0}
  />
);
