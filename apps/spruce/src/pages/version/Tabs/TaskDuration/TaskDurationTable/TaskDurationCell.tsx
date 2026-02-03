import styled from "@emotion/styled";
import { Description } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants";
import {
  mapTaskToBarchartColor,
  mapTaskStatusToUmbrellaStatus,
} from "constants/task";
import { string } from "utils";

const { msToDuration } = string;

interface TaskDurationCellProps {
  maxTimeTaken: number;
  status: string;
  timeTaken: number;
}

export const TaskDurationCell: React.FC<TaskDurationCellProps> = ({
  maxTimeTaken,
  status,
  timeTaken,
}) => {
  const barWidth = calculateBarWidth(timeTaken, maxTimeTaken);
  const barColor =
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    mapTaskToBarchartColor[mapTaskStatusToUmbrellaStatus[status]];
  return (
    <Duration>
      <DurationBar color={barColor} width={barWidth} />
      <DurationLabel>{msToDuration(timeTaken) || "0s"}</DurationLabel>
    </Duration>
  );
};

const calculateBarWidth = (value: number, max: number) =>
  max ? `${(value / max) * 100}%` : "0%";

const Duration = styled.div`
  width: 100%;
  padding: ${size.s} 0;
`;

const DurationBar = styled.div<{ width: string; color: string }>`
  width: ${({ width }) => width};
  background-color: ${({ color }) => color};
  border-radius: ${size.m};
  height: 6px;
`;

const DurationLabel = styled(Description)`
  flex-shrink: 0;
  font-size: 12px;
`;
