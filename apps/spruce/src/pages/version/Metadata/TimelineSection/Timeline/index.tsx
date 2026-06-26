import {
  MetadataTimelineContainer,
  MetadataTimelineTimestampRow,
} from "components/MetadataCard/MetadataTimeline";
import { VersionQuery } from "gql/generated/types";

type Version = NonNullable<VersionQuery["version"]>;

interface TimelineProps {
  version: Version;
}

export const Timeline: React.FC<TimelineProps> = ({ version }) => {
  const { createTime, finishTime, startTime } = version;

  const hasTimelineData = createTime || startTime || finishTime;

  if (!hasTimelineData) {
    return null;
  }

  return (
    <MetadataTimelineContainer>
      {createTime && (
        <MetadataTimelineTimestampRow
          data-cy="version-metadata-submitted-at"
          label="Submitted"
          timestamp={createTime}
        />
      )}
      {startTime && (
        <MetadataTimelineTimestampRow
          data-cy="version-metadata-started"
          label="Started"
          timestamp={startTime}
        />
      )}
      {finishTime && (
        <MetadataTimelineTimestampRow
          data-cy="version-metadata-finished"
          label="Finished"
          timestamp={finishTime}
        />
      )}
    </MetadataTimelineContainer>
  );
};
