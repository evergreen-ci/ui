import {
  MetadataTimelineContainer,
  MetadataTimelineTimestampRow,
} from "components/MetadataCard/MetadataTimeline";

interface TimelineEntry {
  dataCy?: string;
  label: string;
  timestamp?: Date | null;
}

interface TimelineProps {
  entries: TimelineEntry[];
}

export const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  const visibleEntries = entries.filter(
    (entry): entry is TimelineEntry & { timestamp: Date } => !!entry.timestamp,
  );

  if (visibleEntries.length === 0) return null;

  return (
    <MetadataTimelineContainer>
      {visibleEntries.map(({ dataCy, label, timestamp }) => (
        <MetadataTimelineTimestampRow
          key={label}
          data-cy={dataCy}
          label={label}
          timestamp={timestamp}
        />
      ))}
    </MetadataTimelineContainer>
  );
};
