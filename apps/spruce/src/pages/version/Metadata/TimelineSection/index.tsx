import { MetadataItem, MetadataSection } from "components/MetadataCard";
import { MetadataTimeline } from "components/MetadataCard/MetadataTimeline";
import { VersionQuery } from "gql/generated/types";
import { msToDuration } from "utils/string";

type Version = NonNullable<VersionQuery["version"]>;

interface TimelineSectionProps {
  version: Version;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  version,
}) => {
  const { createTime, finishTime, startTime, versionTiming } = version;
  const { makespan, timeTaken } = versionTiming || {};

  return (
    <MetadataSection title="Timeline">
      <MetadataTimeline
        entries={[
          {
            dataCy: "version-metadata-submitted-at",
            label: "Submitted",
            timestamp: createTime,
          },
          {
            dataCy: "version-metadata-started",
            label: "Started",
            timestamp: startTime,
          },
          {
            dataCy: "version-metadata-finished",
            label: "Finished",
            timestamp: finishTime,
          },
        ]}
      />
      {makespan ? (
        <MetadataItem
          label="Makespan"
          tooltipDescription="Makespan represents the wall clock time of this version's execution."
        >
          {msToDuration(makespan)}
        </MetadataItem>
      ) : null}
      {timeTaken ? (
        <MetadataItem
          label="Time taken"
          tooltipDescription="Time taken represents the total time spent executing tasks for this version."
        >
          {msToDuration(timeTaken)}
        </MetadataItem>
      ) : null}
    </MetadataSection>
  );
};
