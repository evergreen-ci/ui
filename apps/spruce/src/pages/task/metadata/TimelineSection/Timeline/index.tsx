import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskQuery } from "gql/generated/types";
import { useDateFormat } from "hooks/useDateFormat";
import { ETARow } from "./ETARow";
import { Label, Timestamp, TimelineContainer, TimelineRow } from "./styles";

type Task = NonNullable<TaskQuery["task"]>;

interface TimelineProps {
  task: Task;
}

export const Timeline: React.FC<TimelineProps> = ({ task }) => {
  const {
    activatedTime,
    displayStatus,
    expectedDuration,
    finishTime,
    ingestTime,
    startTime,
  } = task;
  const isRunning = displayStatus === TaskStatus.Started;
  const getDateCopy = useDateFormat();

  const hasTimelineData =
    ingestTime || activatedTime || startTime || finishTime;

  if (!hasTimelineData) {
    return null;
  }

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
      {isRunning && startTime && expectedDuration ? (
        <ETARow expectedDuration={expectedDuration} startTime={startTime} />
      ) : null}
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
