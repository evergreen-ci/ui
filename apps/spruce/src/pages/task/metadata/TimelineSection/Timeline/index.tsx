import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { useDateFormat } from "hooks/useDateFormat";

const { blue } = palette;

interface TimelineProps {
  activatedTime?: Date | null;
  finishTime?: Date | null;
  ingestTime?: Date | null;
  startTime?: Date | null;
}

export const Timeline: React.FC<TimelineProps> = ({
  activatedTime,
  finishTime,
  ingestTime,
  startTime,
}) => {
  const getDateCopy = useDateFormat();

  return (
    <TimelineContainer>
      {ingestTime && (
        <TimelineRow data-cy="task-metadata-submitted-at">
          <Label>Submitted</Label>
          <Timestamp title={getDateCopy(ingestTime)}>
            {getDateCopy(ingestTime, { omitSeconds: true })}
          </Timestamp>
        </TimelineRow>
      )}
      {activatedTime && (
        <TimelineRow data-cy="task-metadata-activated-at">
          <Label>Activated</Label>
          <Timestamp title={getDateCopy(activatedTime)}>
            {getDateCopy(activatedTime, { omitSeconds: true })}
          </Timestamp>
        </TimelineRow>
      )}
      {startTime && (
        <TimelineRow data-cy="task-metadata-started">
          <Label>Started</Label>
          <Timestamp title={getDateCopy(startTime)}>
            {getDateCopy(startTime, { omitSeconds: true })}
          </Timestamp>
        </TimelineRow>
      )}
      {finishTime && (
        <TimelineRow data-cy="task-metadata-finished">
          <Label>Finished</Label>
          <Timestamp title={getDateCopy(finishTime)}>
            {getDateCopy(finishTime, { omitSeconds: true })}
          </Timestamp>
        </TimelineRow>
      )}
    </TimelineContainer>
  );
};

const DOT_SIZE = 10;
const ROW_GAP = 12;
const LABEL_WIDTH = 60;

const TimelineContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;

  display: flex;
  flex-direction: column;
  gap: ${ROW_GAP}px;

  &:not(:last-child) {
    margin-bottom: ${size.xs};
  }
`;

const Label = styled.b`
  width: ${LABEL_WIDTH}px;
`;

const Timestamp = styled.span`
  color: ${palette.gray.dark1};
  font-variant-numeric: tabular-nums;
`;

const TimelineRow = styled.li`
  font-size: 12px;
  line-height: ${size.s};
  padding-left: ${size.s};

  position: relative;
  display: flex;
  align-items: flex-start;
  gap: ${size.xs};

  // Dashed lines.
  &:not(:last-child)::before {
    content: "";
    position: absolute;
    left: calc(${DOT_SIZE / 2}px);
    top: calc(50% + ${DOT_SIZE / 2}px);
    bottom: -${ROW_GAP}px;

    border-left: 1px dashed ${blue.base};
  }

  // Dots.
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: ${size.xxs};

    width: ${DOT_SIZE}px;
    height: ${DOT_SIZE}px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(0, 123, 255, 1) 20%,
      rgba(0, 123, 255, 0) 70%
    );
  }
`;
