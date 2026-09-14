import { formatDistanceToNow } from "date-fns";
import { StyledLink, WordBreak } from "@evg-ui/lib/components/styles";
import MetadataCard, { MetadataItem } from "components/MetadataCard";
import { MCI_USER } from "constants/hosts";
import { getDistroSettingsRoute, getTaskRoute } from "constants/routes";
import { HostQuery } from "gql/generated/types";
import styles from "./Metadata.module.css";

export const Metadata: React.FC<{
  loading: boolean;
  host: HostQuery["host"];
  error: Error | undefined;
}> = ({ error, host, loading }) => {
  const {
    ami,
    distro,
    hostUrl,
    lastCommunicationTime,
    persistentDnsName,
    provider,
    runningTask,
    startedBy,
    uptime,
    user,
  } = host ?? {};

  const { id: runningTaskId, name: runningTaskName } = runningTask ?? {};
  const distroId = distro?.id;

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const taskLink = getTaskRoute(runningTaskId);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const distroLink = getDistroSettingsRoute(distroId);

  return (
    <MetadataCard error={error} loading={loading} title="Host Details">
      <MetadataItem label="User">{user}</MetadataItem>
      {hostUrl && <MetadataItem label="Host name">{hostUrl}</MetadataItem>}
      {persistentDnsName && (
        <MetadataItem label="Persistent DNS name">
          {persistentDnsName}
        </MetadataItem>
      )}
      {lastCommunicationTime && (
        <MetadataItem
          data-testid="host-last-communication"
          label="Last communication"
        >
          {formatDistanceToNow(new Date(lastCommunicationTime))} ago
        </MetadataItem>
      )}
      <MetadataItem label="Uptime">
        {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
        {formatDistanceToNow(new Date(uptime))}
      </MetadataItem>
      <MetadataItem label="Started by">{startedBy}</MetadataItem>
      <MetadataItem label="Cloud provider">{provider}</MetadataItem>
      {ami && <MetadataItem label="AMI">{ami}</MetadataItem>}
      <MetadataItem label="Distro">
        <StyledLink data-testid="distro-link" href={distroLink}>
          {distroId}
        </StyledLink>
      </MetadataItem>
      {startedBy === MCI_USER && (
        <MetadataItem data-testid="current-running-task" label="Current task">
          {runningTaskName ? (
            <StyledLink data-testid="running-task-link" href={taskLink}>
              <WordBreak all>{runningTaskName}</WordBreak>
            </StyledLink>
          ) : (
            <i className={styles.emptyValue}>none</i>
          )}
        </MetadataItem>
      )}
    </MetadataCard>
  );
};
