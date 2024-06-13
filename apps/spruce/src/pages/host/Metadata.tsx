import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { formatDistanceToNow } from "date-fns";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
} from "components/MetadataCard";
import { StyledLink, WordBreak } from "components/styles";
import { MCI_USER } from "constants/hosts";
import { getDistroSettingsRoute, getTaskRoute } from "constants/routes";
import { HostQuery } from "gql/generated/types";

const { gray } = palette;

export const Metadata: React.FC<{
  loading: boolean;
  host: HostQuery["host"];
  error: ApolloError;
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
    <MetadataCard error={error} loading={loading}>
      <MetadataTitle>Host Details</MetadataTitle>
      <MetadataItem>User: {user}</MetadataItem>
      {hostUrl && <MetadataItem>Host Name: {hostUrl}</MetadataItem>}
      {persistentDnsName && (
        <MetadataItem>Persistent DNS Name: {persistentDnsName}</MetadataItem>
      )}
      {lastCommunicationTime && (
        <MetadataItem data-cy="host-last-communication">
          Last Communication:{" "}
          {formatDistanceToNow(new Date(lastCommunicationTime))} ago
        </MetadataItem>
      )}
      <MetadataItem>
        {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
        Uptime: {formatDistanceToNow(new Date(uptime))}
      </MetadataItem>
      <MetadataItem>Started By: {startedBy}</MetadataItem>
      <MetadataItem>Cloud Provider: {provider}</MetadataItem>
      {ami && <MetadataItem>AMI: {ami}</MetadataItem>}
      <MetadataItem>
        Distro:{" "}
        <StyledLink data-cy="distro-link" href={distroLink}>
          {distroId}
        </StyledLink>
      </MetadataItem>
      {startedBy === MCI_USER && (
        <MetadataItem data-cy="current-running-task">
          Current Task:{" "}
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
