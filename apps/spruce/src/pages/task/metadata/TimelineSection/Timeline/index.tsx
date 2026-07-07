import { TaskStatus } from "@evg-ui/lib/types/task";
import {
  MetadataTimelineContainer,
  MetadataTimelineTimestampRow,
} from "components/MetadataCard/MetadataTimeline";
import { TaskQuery } from "gql/generated/types";
import { ETARow } from "./ETARow";

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

  const hasTimelineData =
    ingestTime || activatedTime || startTime || finishTime;

  if (!hasTimelineData) {
    return null;
  }

  return (
    <MetadataTimelineContainer>
      {ingestTime && (
        <MetadataTimelineTimestampRow
          data-cy="task-metadata-submitted-at"
          label="Submitted"
          timestamp={ingestTime}
        />
      )}
      {activatedTime && (
        <MetadataTimelineTimestampRow
          data-cy="task-metadata-activated-at"
          label="Activated"
          timestamp={activatedTime}
        />
      )}
      {startTime && (
        <MetadataTimelineTimestampRow
          data-cy="task-metadata-started"
          label="Started"
          timestamp={startTime}
        />
      )}
      {isRunning && startTime && expectedDuration ? (
        <ETARow expectedDuration={expectedDuration} startTime={startTime} />
      ) : null}
      {finishTime && (
        <MetadataTimelineTimestampRow
          data-cy="task-metadata-finished"
          label="Finished"
          timestamp={finishTime}
        />
      )}
    </MetadataTimelineContainer>
  );
};
