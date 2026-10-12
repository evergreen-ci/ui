import { Tooltip } from "@leafygreen-ui/tooltip";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { getTaskRoute } from "constants/routes";
import { formatZeroIndexForDisplay } from "utils/numbers";
import { msToDuration } from "utils/string";
import { TaskDurationCell } from "./TaskDurationCell";
import styles from "./TaskDurationTable.module.css";
import { TaskDurationData } from "./types";

interface BaseTaskDurationCellProps extends Pick<
  TaskDurationData,
  "baseTask" | "displayName"
> {
  comparisonLabel: string;
  maxTimeTaken: number;
}

export const BaseTaskDurationCell: React.FC<BaseTaskDurationCellProps> = ({
  baseTask,
  comparisonLabel,
  displayName,
  maxTimeTaken,
}) =>
  baseTask?.finishTime && baseTask.timeTaken != null ? (
    <TaskDurationCell
      maxTimeTaken={maxTimeTaken}
      status={baseTask.displayStatus}
      timeTaken={baseTask.timeTaken}
    >
      <StyledRouterLink
        aria-label={`${comparisonLabel} task duration for ${displayName}: ${msToDuration(baseTask.timeTaken)}`}
        title={`${taskStatusToCopy[baseTask.displayStatus as TaskStatus] ?? baseTask.displayStatus}, execution ${formatZeroIndexForDisplay(baseTask.execution)}; ${baseTask.timeTaken / 1000}s`}
        to={getTaskRoute(baseTask.id, { execution: baseTask.execution })}
      >
        {msToDuration(baseTask.timeTaken)}
      </StyledRouterLink>
    </TaskDurationCell>
  ) : (
    <Tooltip
      trigger={
        <button className={styles.tooltipTrigger} type="button">
          Unavailable
        </button>
      }
    >
      {getUnavailableReason(baseTask)}
    </Tooltip>
  );

const getUnavailableReason = (baseTask: TaskDurationData["baseTask"]) => {
  if (!baseTask) {
    return "No matching task was found for this comparison.";
  }
  if (!baseTask.finishTime) {
    return "The comparison task has not finished.";
  }
  return "The comparison task has no recorded duration.";
};
