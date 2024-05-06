import { useJobLogsAnalytics } from "analytics";
import {
  MetadataCard,
  MetadataItem,
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
        <MetadataItem>Group: {metadata.groupID}</MetadataItem>
      )}
      {metadata.builder && (
        <MetadataItem>Builder: {metadata.builder}</MetadataItem>
      )}
      {metadata.buildNum && (
        <MetadataItem>Build number: {metadata.buildNum}</MetadataItem>
      )}
      <MetadataItem>
        <StyledLink
          data-cy="complete-test-logs-link"
          href={metadata.completeLogsURL}
          target="_blank"
          onClick={() => {
            sendEvent({
              name: "Clicked complete logs link",
              buildId: metadata.buildId,
              taskId: metadata.taskId,
              execution: metadata.execution,
              groupID: metadata.groupID,
            });
          }}
        >
          Complete logs for all tests
        </StyledLink>
      </MetadataItem>
    </MetadataCard>
  );
};
