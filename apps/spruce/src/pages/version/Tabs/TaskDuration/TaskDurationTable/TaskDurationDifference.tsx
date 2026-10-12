import styled from "@emotion/styled";
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
  const shouldHighlight =
    absoluteDifference >
    Math.max(
      MIN_DURATION_DIFFERENCE_MS,
      baseTask.timeTaken * DURATION_DIFFERENCE_THRESHOLD,
    );
  const highlightColor = difference > 0 ? red.dark2 : green.dark2;
  const color = shouldHighlight ? highlightColor : gray.dark1;
  const nonZeroSign = difference > 0 ? "+" : "−";
  const sign = difference === 0 ? "" : nonZeroSign;
  const description =
    difference === 0
      ? `Same duration as the ${comparisonLabel.toLowerCase()} task`
      : `${absoluteDifference / 1000}s ${difference > 0 ? "longer" : "shorter"} than the ${comparisonLabel.toLowerCase()} task`;

  return (
    <>
      <span aria-hidden="true"> · </span>
      <Difference aria-label={description} color={color} title={description}>
        {sign}
        {msToDuration(absoluteDifference)}
      </Difference>
    </>
  );
};

const Difference = styled.span<{ color: string }>`
  color: ${({ color }) => color};
`;
