import { useJobLogsAnalytics } from "analytics";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
} from "components/MetadataCard";
import { StyledLink } from "components/styles";
import { getParsleyCompleteLogsURL } from "constants/externalResources";
import { JobLogsMetadata } from "./types";

export const Metadata: React.FC<{
  loading: boolean;
  metadata: JobLogsMetadata;
  isLogkeeper: boolean;
}> = ({ isLogkeeper, loading, metadata }) => {
  const { sendEvent } = useJobLogsAnalytics(metadata.isLogkeeper);
  const { execution, groupID, taskId } = metadata;
  let completeLogsURL = "";
  if (!isLogkeeper) {
    completeLogsURL = getParsleyCompleteLogsURL(taskId, execution, groupID);
  } else if (metadata.allLogsURL) {
    completeLogsURL = metadata.allLogsURL;
  }

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
      {completeLogsURL && (
        <MetadataItem>
          <StyledLink
            data-cy="complete-test-logs-link"
            href={completeLogsURL}
            target="_blank"
            onClick={() => {
              sendEvent({
                name: "Clicked complete logs link",
                buildId: metadata.buildId,
                taskId,
                execution,
                groupID,
              });
            }}
          >
            Complete logs for all tests
          </StyledLink>
        </MetadataItem>
      )}
    </MetadataCard>
  );
};
