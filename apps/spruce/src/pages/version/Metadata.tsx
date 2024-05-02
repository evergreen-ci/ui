import { InlineCode, Disclaimer } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
} from "components/MetadataCard";
import { StyledLink, StyledRouterLink } from "components/styles";
import {
  getGithubCommitUrl,
  getGithubMergeQueueUrl,
} from "constants/externalResources";
import { githubMergeRequester } from "constants/patch";
import {
  getCommitQueueRoute,
  getProjectPatchesRoute,
  getTriggerRoute,
  getUserPatchesRoute,
  getVersionRoute,
} from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { string } from "utils";
import { formatZeroIndexForDisplay } from "utils/numbers";
import ManifestBlob from "./ManifestBlob";
import { ParametersModal } from "./ParametersModal";

const { msToDuration, shortenGithash } = string;

interface Props {
  loading: boolean;
  version: VersionQuery["version"];
}

export const Metadata: React.FC<Props> = ({ loading, version }) => {
  const getDateCopy = useDateFormat();
  const {
    author,
    authorEmail,
    baseVersion,
    createTime,
    externalLinksForMetadata,
    finishTime,
    gitTags,
    id,
    isPatch,
    manifest,
    parameters,
    patch,
    previousVersion,
    project,
    projectIdentifier,
    projectMetadata,
    requester,
    revision,
    startTime,
    upstreamProject,
    versionTiming,
  } = version || {};
  const { sendEvent } = useVersionAnalytics(id);
  const { commitQueuePosition } = patch || {};
  const { makespan, timeTaken } = versionTiming || {};
  const {
    owner: upstreamOwner,
    project: upstreamProjectIdentifier,
    repo: upstreamRepo,
    revision: upstreamRevision,
    task: upstreamTask,
    triggerType,
    version: upstreamVersion,
  } = upstreamProject || {};

  const { branch, owner, repo } = projectMetadata || {};

  const isGithubMergePatch = requester === githubMergeRequester;

  return (
    <MetadataCard loading={loading} error={null}>
      <MetadataTitle>
        {isPatch ? "Patch Metadata" : "Version Metadata"}
      </MetadataTitle>

      <MetadataItem>
        Project:{" "}
        {projectIdentifier ? (
          <StyledRouterLink
            to={getProjectPatchesRoute(projectIdentifier)}
            onClick={() =>
              sendEvent({ name: "Click Project Patches Metadata Link" })
            }
          >
            {projectIdentifier}
          </StyledRouterLink>
        ) : (
          `${owner}/${repo}`
        )}
      </MetadataItem>
      <MetadataItem>
        Makespan: {makespan && msToDuration(makespan)}
      </MetadataItem>
      <MetadataItem>
        Time taken: {timeTaken && msToDuration(timeTaken)}
      </MetadataItem>
      <MetadataItem>
        Submitted at:{" "}
        {createTime && (
          <span title={getDateCopy(createTime)}>
            {getDateCopy(createTime, { omitSeconds: true })}
          </span>
        )}
      </MetadataItem>
      <MetadataItem>
        Started:{" "}
        {startTime && (
          <span title={getDateCopy(startTime)}>
            {getDateCopy(startTime, { omitSeconds: true })}
          </span>
        )}
      </MetadataItem>
      {finishTime && (
        <MetadataItem>
          Finished:{" "}
          <span title={getDateCopy(finishTime)}>
            {getDateCopy(finishTime, { omitSeconds: true })}
          </span>
        </MetadataItem>
      )}
      <MetadataItem>
        Submitted by:{" "}
        <StyledRouterLink
          to={getUserPatchesRoute(getAuthorUsername(authorEmail))}
          data-cy="user-patches-link"
        >
          {author}
        </StyledRouterLink>
      </MetadataItem>
      {isPatch ? (
        <BaseCommitMetadata
          baseVersionId={baseVersion?.id}
          isGithubMergePatch={isGithubMergePatch}
          onClick={() => sendEvent({ name: "Click Base Commit Link" })}
          revision={revision}
        />
      ) : (
        <MetadataItem>
          Previous commit:{" "}
          <InlineCode
            as={Link}
            data-cy="version-previous-commit"
            onClick={() => sendEvent({ name: "Click Previous Version Link" })}
            to={getVersionRoute(previousVersion?.id)}
          >
            {shortenGithash(previousVersion?.revision)}
          </InlineCode>
        </MetadataItem>
      )}
      {isGithubMergePatch && (
        <MetadataItem>
          <StyledLink
            href={getGithubMergeQueueUrl(owner, repo, branch)}
            data-cy="github-merge-queue-link"
          >
            GitHub Merge Queue
          </StyledLink>
        </MetadataItem>
      )}
      {!isPatch && (
        <MetadataItem>
          GitHub commit:{" "}
          <InlineCode
            data-cy="version-github-commit"
            href={getGithubCommitUrl(owner, repo, revision)}
            onClick={() => sendEvent({ name: "Click Github Commit Link" })}
          >
            {shortenGithash(revision)}
          </InlineCode>
        </MetadataItem>
      )}
      {isPatch && commitQueuePosition !== null && (
        <MetadataItem>
          <StyledRouterLink
            data-cy="commit-queue-position"
            to={getCommitQueueRoute(project)}
          >
            Commit queue position:{" "}
            {formatZeroIndexForDisplay(commitQueuePosition)}
          </StyledRouterLink>
        </MetadataItem>
      )}
      {manifest && <ManifestBlob manifest={manifest} />}
      {upstreamProject && (
        <MetadataItem>
          Triggered from:{" "}
          <StyledRouterLink
            to={getTriggerRoute({
              triggerType,
              upstreamTask,
              upstreamVersion,
              upstreamRevision,
              upstreamOwner,
              upstreamRepo,
            })}
          >
            {upstreamProjectIdentifier}
          </StyledRouterLink>
        </MetadataItem>
      )}
      <ParametersModal parameters={parameters} />
      {externalLinksForMetadata?.map(({ displayName, url }) => (
        <MetadataItem key={displayName}>
          <StyledLink data-cy="external-link" href={url}>
            {displayName}
          </StyledLink>
        </MetadataItem>
      ))}
      {gitTags && (
        <MetadataItem>
          {gitTags.map((g) => (
            <Disclaimer key={g.tag}>
              Tag {g.tag} pushed by {g.pusher}
            </Disclaimer>
          ))}
        </MetadataItem>
      )}
    </MetadataCard>
  );
};

interface BaseCommitMetadataProps {
  baseVersionId: string;
  isGithubMergePatch: boolean;
  onClick: () => void;
  revision: string;
}

const BaseCommitMetadata: React.FC<BaseCommitMetadataProps> = ({
  baseVersionId,
  isGithubMergePatch,
  onClick,
  revision,
}) => {
  const isPending = isGithubMergePatch && !baseVersionId;

  return (
    <MetadataItem>
      Base commit:{" "}
      {isPending ? (
        <InlineCode data-cy="patch-base-commit">
          {shortenGithash(revision)}
        </InlineCode>
      ) : (
        <InlineCode
          as={Link}
          data-cy="patch-base-commit"
          onClick={onClick}
          to={getVersionRoute(baseVersionId)}
        >
          {shortenGithash(revision)}
        </InlineCode>
      )}
      {isPending && " (pending)"}
    </MetadataItem>
  );
};

const getAuthorUsername = (email: string) => {
  const atIndex = email.indexOf("@");
  return atIndex === -1 ? email : email.substring(0, atIndex);
};
