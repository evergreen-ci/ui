import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { formatDistanceToNow } from "date-fns";
import { WordBreak, StyledLink } from "@evg-ui/lib/components/styles";
import MetadataCard, {
  MetadataItem,
  MetadataLabel,
} from "components/MetadataCard";
import { MCI_USER } from "constants/hosts";
import { getDistroSettingsRoute, getTaskRoute } from "constants/routes";
import { HostQuery } from "gql/generated/types";

const { gray } = palette;

export const Metadata: React.FC<{
  loading: boolean;
  host: HostQuery["host"];
  error: Error | undefined;
}> = ({ error, host, loading }) => {
  const {
    ami,
    distroId,
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

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const taskLink = getTaskRoute(runningTaskId);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const distroLink = getDistroSettingsRoute(distroId);

  return (
    <MetadataCard error={error} loading={loading} title="Host Details">
      <MetadataItem>
        <MetadataLabel>User:</MetadataLabel> {user}
      </MetadataItem>
      {hostUrl && (
        <MetadataItem>
          <MetadataLabel>Host Name:</MetadataLabel> {hostUrl}
        </MetadataItem>
      )}
      {persistentDnsName && (
        <MetadataItem>
          <MetadataLabel>Persistent DNS Name:</MetadataLabel>{" "}
          {persistentDnsName}
        </MetadataItem>
      )}
      {lastCommunicationTime && (
        <MetadataItem data-cy="host-last-communication">
          <MetadataLabel>Last Communication:</MetadataLabel>{" "}
          {formatDistanceToNow(new Date(lastCommunicationTime))} ago
        </MetadataItem>
      )}
      <MetadataItem>
        <MetadataLabel>Uptime:</MetadataLabel>{" "}
        {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
        {formatDistanceToNow(new Date(uptime))}
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Started By:</MetadataLabel> {startedBy}
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Cloud Provider:</MetadataLabel> {provider}
      </MetadataItem>
      {ami && (
        <MetadataItem>
          <MetadataLabel>AMI:</MetadataLabel> {ami}
        </MetadataItem>
      )}
      <MetadataItem>
        <MetadataLabel>Distro:</MetadataLabel>{" "}
        <StyledLink data-cy="distro-link" href={distroLink}>
          {distroId}
        </StyledLink>
      </MetadataItem>
      {startedBy === MCI_USER && (
        <MetadataItem data-cy="current-running-task">
          <MetadataLabel>Current Task:</MetadataLabel>{" "}
          {runningTaskName ? (
            <StyledLink data-cy="running-task-link" href={taskLink}>
              <WordBreak all>{runningTaskName}</WordBreak>
            </StyledLink>
          ) : (
            <Italic>none</Italic>
          )}
        </MetadataItem>
      )}
    </MetadataCard>
  );
};

const Italic = styled.i`
  color: ${gray.light1};
`;
