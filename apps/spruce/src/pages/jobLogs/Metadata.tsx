import { Link } from "@via-ds/components/typography";
import { useJobLogsAnalytics } from "analytics";
import MetadataCard, { MetadataItem } from "components/MetadataCard";
import { JobLogsMetadata } from "./types";

export const Metadata: React.FC<{
  loading: boolean;
  metadata: JobLogsMetadata;
}> = ({ loading, metadata }) => {
  const { sendEvent } = useJobLogsAnalytics();

  return (
    <MetadataCard loading={loading} title="Job log details">
      {metadata.groupID && (
        <MetadataItem label="Group">{metadata.groupID}</MetadataItem>
      )}
      <MetadataItem>
        <Link
          data-testid="complete-test-logs-link"
          href={metadata.completeLogsURL}
          linkStyle="internal"
          onPress={() => {
            sendEvent({
              name: "Clicked complete logs link",
              "task.id": metadata.taskId,
              execution: metadata.execution,
              "group.id": metadata.groupID,
            });
          }}
          rel="noopener noreferrer"
          target="_blank"
        >
          Complete logs for all tests in this job
        </Link>
      </MetadataItem>
    </MetadataCard>
  );
};
