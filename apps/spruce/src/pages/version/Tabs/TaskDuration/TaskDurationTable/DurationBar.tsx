import styled from "@emotion/styled";
import { Description } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import {
  mapTaskStatusToUmbrellaStatus,
  mapTaskToBarchartColor,
} from "constants/task";

interface DurationBarProps {
  children: React.ReactNode;
  maxTimeTaken: number;
  status: string;
  timeTaken: number;
}

export const DurationBar: React.FC<DurationBarProps> = ({
  children,
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
      <Bar color={barColor} width={barWidth} />
      <DurationLabel title={`${timeTaken / 1000}s`}>{children}</DurationLabel>
    </Duration>
  );
};

const calculateBarWidth = (value: number, max: number) =>
  max ? `${(value / max) * 100}%` : "0%";

const Duration = styled.div`
  width: 100%;
  padding: ${size.s} 0;
`;

const Bar = styled.div<{ width: string; color: string }>`
  width: ${({ width }) => width};
  background-color: ${({ color }) => color};
  border-radius: ${size.m};
  height: 6px;
`;

const DurationLabel = styled(Description)`
  flex-shrink: 0;
  font-size: 12px;
`;
