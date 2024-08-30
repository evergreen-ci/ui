import { ApolloError } from "@apollo/client";
import { InlineCode } from "@leafygreen-ui/typography";
import {
  MetadataCard,
  MetadataItem,
  MetadataLabel,
  MetadataTitle,
} from "components/MetadataCard";
import { StyledRouterLink, WordBreak } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { PodQuery } from "gql/generated/types";

const Metadata: React.FC<{
  loading: boolean;
  pod: PodQuery["pod"];
  error: ApolloError;
}> = ({ error, loading, pod }) => {
  const { task, taskContainerCreationOpts, type } = pod ?? {};
  const { arch, cpu, memoryMB, os, workingDir } =
    taskContainerCreationOpts ?? {};
  const {
    displayName: runningTaskDisplayName,
    execution: runningTaskExecution,
    id: runningTaskId,
  } = task ?? {};

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const taskLink = getTaskRoute(runningTaskId, {
    execution: runningTaskExecution,
  });

  return (
    <MetadataCard error={error} loading={loading}>
      <MetadataTitle>Container Details</MetadataTitle>
      {runningTaskId !== "" && (
        <MetadataItem>
          <MetadataLabel>Running Task:</MetadataLabel>{" "}
          <StyledRouterLink to={taskLink}>
            <WordBreak all>{runningTaskDisplayName}</WordBreak>
          </StyledRouterLink>
        </MetadataItem>
      )}
      <MetadataItem>
        <MetadataLabel>Container Type:</MetadataLabel> {type}
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>CPU:</MetadataLabel> {cpu}
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Memory:</MetadataLabel> {memoryMB} MB
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Operating System:</MetadataLabel> {os}
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>CPU Architecture:</MetadataLabel> {arch}
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Working Directory:</MetadataLabel>{" "}
        <InlineCode>{workingDir}</InlineCode>
      </MetadataItem>
    </MetadataCard>
  );
};

export default Metadata;
