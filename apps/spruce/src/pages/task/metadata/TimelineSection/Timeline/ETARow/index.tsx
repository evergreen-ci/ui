import { useEffect } from "react";
import { MetadataTimelineRow } from "components/MetadataCard/MetadataTimeline";
import { useRunningTime } from "hooks";
import { msToDuration } from "utils/string";

interface ETARowProps {
  expectedDuration: number;
  startTime: Date;
}

export const ETARow: React.FC<ETARowProps> = ({
  expectedDuration,
  startTime,
}) => {
  const { endTimer, runningTime } = useRunningTime(new Date(startTime));
  useEffect(() => {
    if (runningTime >= expectedDuration) {
      endTimer();
    }
  }, [runningTime, expectedDuration, endTimer]);

  const eta = expectedDuration - runningTime;
  if (eta < 0) return null;
  return (
    <MetadataTimelineRow data-cy="eta-timer" isRunning label="ETA">
      {msToDuration(eta)}
    </MetadataTimelineRow>
  );
};
