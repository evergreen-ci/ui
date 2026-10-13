import { palette } from "@leafygreen-ui/palette";
import { msToDuration } from "utils/string";
import { TaskDurationData } from "./types";

const { gray, green, red } = palette;
const DURATION_DIFFERENCE_THRESHOLD = 0.1;
const MIN_DURATION_DIFFERENCE_MS = 5000;

interface TaskDurationDifferenceProps extends Pick<
  TaskDurationData,
  "baseTask" | "finishTime" | "timeTaken"
> {
  comparisonLabel: string;
}

export const TaskDurationDifference: React.FC<TaskDurationDifferenceProps> = ({
  baseTask,
  comparisonLabel,
  finishTime,
  timeTaken,
}) => {
  if (
    !finishTime ||
    timeTaken == null ||
    !baseTask?.finishTime ||
    baseTask.timeTaken == null
  ) {
    return null;
  }

  const difference = timeTaken - baseTask.timeTaken;
  const absoluteDifference = Math.abs(difference);
  const color = getDifferenceColor(difference, baseTask.timeTaken);
  const sign = getDifferenceSign(difference);
  const description =
    difference === 0
      ? `Same duration as the ${comparisonLabel.toLowerCase()} task`
      : `${absoluteDifference / 1000}s ${difference > 0 ? "longer" : "shorter"} than the ${comparisonLabel.toLowerCase()} task`;

  return (
    <>
      <span aria-hidden="true"> · </span>
      <span aria-label={description} style={{ color }} title={description}>
        {sign}
        {msToDuration(absoluteDifference)}
      </span>
    </>
  );
};

const getDifferenceColor = (difference: number, baseTimeTaken: number) => {
  const shouldHighlight =
    Math.abs(difference) >
    Math.max(
      MIN_DURATION_DIFFERENCE_MS,
      baseTimeTaken * DURATION_DIFFERENCE_THRESHOLD,
    );
  if (!shouldHighlight) {
    return gray.dark1;
  }
  return difference > 0 ? red.dark2 : green.dark2;
};

const getDifferenceSign = (difference: number) => {
  if (difference === 0) {
    return "";
  }
  return difference > 0 ? "+" : "−";
};
