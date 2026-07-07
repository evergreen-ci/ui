import { MetadataItem, MetadataSection } from "components/MetadataCard";
import { VersionQuery } from "gql/generated/types";
import { msToDuration } from "utils/string";
import { Timeline } from "./Timeline";

type Version = NonNullable<VersionQuery["version"]>;

interface TimelineSectionProps {
  version: Version;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  version,
}) => {
  const { versionTiming } = version;
  const { makespan, timeTaken } = versionTiming || {};

  return (
    <MetadataSection title="Timeline">
      <Timeline version={version} />
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
