import { TaskStatus } from "@evg-ui/lib/types/task";
import { MetadataItem, MetadataSection } from "components/MetadataCard";
import { TaskQuery } from "gql/generated/types";
import { msToDuration } from "utils/string";
import { ETATimer } from "./ETATimer";
import { RuntimeTimer } from "./RuntimeTimer";
import { Timeline } from "./Timeline";

type Task = NonNullable<TaskQuery["task"]>;

interface TimelineProps {
  task: Task;
}

export const TimelineSection: React.FC<TimelineProps> = ({ task }) => {
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

  return (
    <MetadataSection title="Timeline">
      <Timeline
        activatedTime={activatedTime}
        finishTime={finishTime}
        ingestTime={ingestTime}
        startTime={startTime}
      />
      {estimatedStart && estimatedStart > 0 ? (
        <MetadataItem label="Estimated time to start">
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
        <MetadataItem data-cy="task-metadata-duration" label="Duration">
          {msToDuration(timeTaken)}
        </MetadataItem>
      ) : null}
      {baseTaskDuration ? (
        <MetadataItem
          data-cy="task-metadata-base-commit-duration"
          label="Base commit duration"
        >
          {msToDuration(baseTaskDuration)}
        </MetadataItem>
      ) : null}
    </MetadataSection>
  );
};
