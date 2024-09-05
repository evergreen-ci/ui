import { useJobLogsAnalytics } from "analytics";
import {
  MetadataCard,
  MetadataItem,
  MetadataLabel,
  MetadataTitle,
} from "components/MetadataCard";
import { StyledLink } from "components/styles";
import { JobLogsMetadata } from "./types";

export const Metadata: React.FC<{
  loading: boolean;
  metadata: JobLogsMetadata;
}> = ({ loading, metadata }) => {
  const { sendEvent } = useJobLogsAnalytics(metadata.isLogkeeper);

  return (
    <MetadataCard loading={loading}>
      <MetadataTitle>Job log details</MetadataTitle>
      {metadata.groupID && (
        <MetadataItem>
          <MetadataLabel>Group:</MetadataLabel> {metadata.groupID}
        </MetadataItem>
      )}
      {metadata.builder && (
        <MetadataItem>
          <MetadataLabel>Builder:</MetadataLabel> {metadata.builder}
        </MetadataItem>
      )}
      {metadata.buildNum && (
        <MetadataItem>
          <MetadataLabel>Build number:</MetadataLabel> {metadata.buildNum}
        </MetadataItem>
      )}
      <MetadataItem>
        <StyledLink
          data-cy="complete-test-logs-link"
          href={metadata.completeLogsURL}
          onClick={() => {
            sendEvent({
              name: "Clicked complete logs link",
              "build.id": metadata.buildId,
              "task.id": metadata.taskId,
              execution: metadata.execution,
              "group.id": metadata.groupID,
            });
          }}
          target="_blank"
        >
          Complete logs for all tests
        </StyledLink>
      </MetadataItem>
    </MetadataCard>
  );
};
