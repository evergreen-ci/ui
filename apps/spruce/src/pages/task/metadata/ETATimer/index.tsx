import { useEffect } from "react";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
import { useRunningTime } from "hooks";
import { string } from "utils";

const { msToDuration } = string;

interface ETATimerProps {
  startTime: Date;
  expectedDuration: number;
}
const ETATimer: React.FC<ETATimerProps> = ({ expectedDuration, startTime }) => {
  const parsedStartTime = new Date(startTime);
  const { endTimer, runningTime } = useRunningTime(parsedStartTime);
  useEffect(() => {
    if (runningTime >= expectedDuration) {
      endTimer();
    }
  }, [runningTime, expectedDuration, endTimer]);

  const eta = expectedDuration - runningTime;
  if (eta < 0) return null;
  return (
    <MetadataItem data-cy="task-metadata-eta">
      <MetadataLabel>ETA:</MetadataLabel> {msToDuration(eta)}
    </MetadataItem>
  );
};

export default ETATimer;
