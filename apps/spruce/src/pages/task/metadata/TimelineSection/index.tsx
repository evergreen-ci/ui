import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import {
  MetadataItem,
  MetadataLabel,
  MetadataSection,
} from "components/MetadataCard";
import { TaskQuery } from "gql/generated/types";
import { useDateFormat } from "hooks/useDateFormat";
import { msToDuration } from "utils/string";
import { ETATimer } from "./ETATimer";
import { RuntimeTimer } from "./RuntimeTimer";

const { blue } = palette;

type Task = NonNullable<TaskQuery["task"]>;

interface TimelineProps {
  task: Task;
}

export const TimelineSection: React.FC<TimelineProps> = ({ task }) => {
  const getDateCopy = useDateFormat();

  const {
    activatedTime,
    baseTask,
    displayStatus,
    estimatedStart,
    expectedDuration,
    finishTime,
    ingestTime,
    startTime,
    timeTaken,
  } = task;

  const baseTaskDuration = baseTask?.timeTaken;

  const hasTimelineData =
    ingestTime || activatedTime || startTime || finishTime;

  return (
    <MetadataSection title="Timeline">
      {hasTimelineData && (
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
      )}
      {estimatedStart && estimatedStart > 0 ? (
        <MetadataItem>
          <MetadataLabel>Estimated time to start:</MetadataLabel>{" "}
          <span data-cy="task-metadata-estimated-start">
            {msToDuration(estimatedStart)}
          </span>
        </MetadataItem>
      ) : null}
      {displayStatus === TaskStatus.Started && startTime && expectedDuration ? (
        <ETATimer expectedDuration={expectedDuration} startTime={startTime} />
      ) : null}
      {displayStatus === TaskStatus.Started && startTime && (
        <RuntimeTimer startTime={startTime} />
      )}
      {finishTime && timeTaken && timeTaken > 0 ? (
        <MetadataItem data-cy="task-metadata-duration">
          <MetadataLabel>Duration:</MetadataLabel> {msToDuration(timeTaken)}
        </MetadataItem>
      ) : null}
      {baseTaskDuration ? (
        <MetadataItem data-cy="task-metadata-base-commit-duration">
          <MetadataLabel>Base commit duration:</MetadataLabel>{" "}
          {msToDuration(baseTaskDuration)}
        </MetadataItem>
      ) : null}
    </MetadataSection>
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
  margin-bottom: ${size.s};
`;

const Label = styled.b`
  width: ${LABEL_WIDTH}px;
`;

const Timestamp = styled.span`
  color: ${palette.gray.dark1};
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
