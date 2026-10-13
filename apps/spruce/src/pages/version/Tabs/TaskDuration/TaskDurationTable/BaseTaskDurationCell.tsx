import { Tooltip } from "@leafygreen-ui/tooltip";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { getTaskRoute } from "constants/routes";
import { formatZeroIndexForDisplay } from "utils/numbers";
import { msToDuration } from "utils/string";
import { DurationBar } from "./DurationBar";
import styles from "./TaskDurationTable.module.css";
import { TaskDurationData } from "./types";

interface BaseTaskDurationCellProps {
  comparisonLabel: string;
  maxTimeTaken: number;
  task: TaskDurationData;
}

export const BaseTaskDurationCell: React.FC<BaseTaskDurationCellProps> = ({
  comparisonLabel,
  maxTimeTaken,
  task: { baseTask, displayName },
}) =>
  baseTask?.finishTime && baseTask.timeTaken != null ? (
    <DurationBar
      label={
        <>
          <span>{msToDuration(baseTask.timeTaken)}</span>
          <span aria-hidden="true"> · </span>
          <StyledRouterLink
            aria-label={`View ${comparisonLabel.toLowerCase()} task for ${displayName}`}
            title={`${taskStatusToCopy[baseTask.displayStatus as TaskStatus] ?? baseTask.displayStatus}, execution ${formatZeroIndexForDisplay(baseTask.execution)}; ${baseTask.timeTaken / 1000}s`}
            to={getTaskRoute(baseTask.id, { execution: baseTask.execution })}
          >
            View task
          </StyledRouterLink>
        </>
      }
      maxTimeTaken={maxTimeTaken}
      status={baseTask.displayStatus}
      timeTaken={baseTask.timeTaken}
    />
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
