import { StyledLink } from "@evg-ui/lib/components/styles";
import { useJobLogsAnalytics } from "analytics";
import MetadataCard, {
  MetadataItem,
  MetadataLabel,
} from "components/MetadataCard";
import { JobLogsMetadata } from "./types";

export const Metadata: React.FC<{
  loading: boolean;
  metadata: JobLogsMetadata;
}> = ({ loading, metadata }) => {
  const { sendEvent } = useJobLogsAnalytics();

  return (
    <MetadataCard loading={loading} title="Job log details">
      {metadata.groupID && (
        <MetadataItem>
          <MetadataLabel>Group:</MetadataLabel> {metadata.groupID}
        </MetadataItem>
      )}
      <MetadataItem>
        <StyledLink
          data-cy="complete-test-logs-link"
          href={metadata.completeLogsURL}
          onClick={() => {
            sendEvent({
              name: "Clicked complete logs link",
              "task.id": metadata.taskId,
              execution: metadata.execution,
              "group.id": metadata.groupID,
            });
          }}
        >
          Complete logs for all tests
        </StyledLink>
      </MetadataItem>
    </MetadataCard>
  );
};
