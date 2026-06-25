import { useEffect } from "react";
import { useRunningTime } from "hooks";
import { msToDuration } from "utils/string";
import { Label, Timestamp, TimelineRow } from "../styles";

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
    <TimelineRow data-cy="eta-timer" isRunning>
      <Label>ETA</Label>
      <Timestamp isRunning>{msToDuration(eta)}</Timestamp>
    </TimelineRow>
  );
};
