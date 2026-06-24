import { InlineCode, Disclaimer } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useVersionAnalytics } from "analytics";
import { CopyableID } from "components/CopyableID";
import { MetadataItem, MetadataSection } from "components/MetadataCard";
import {
  getGithubCommitUrl,
  getGithubMergeQueueUrl,
  getGithubPRUrl,
} from "constants/externalResources";
import { Requester } from "constants/requesters";
import {
  getProjectPatchesRoute,
  getTriggerRoute,
  getUserPatchesRoute,
  getVersionRoute,
} from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import IncludedLocalModules from "../IncludedLocalModules";
import ManifestBlob from "../ManifestBlob";

type Version = NonNullable<VersionQuery["version"]>;

interface GeneralSectionProps {
  version: Version;
}

export const GeneralSection: React.FC<GeneralSectionProps> = ({ version }) => {
  const {
    baseVersion,
    gitTags,
    id,
    isPatch,
    manifest,
    patch,
    previousVersion,
    projectMetadata,
    requester,
    revision,
    upstreamProject,
    user,
  } = version;
  const { sendEvent } = useVersionAnalytics(id);
  const { githubPatchData, includedLocalModules } = patch || {};
  const { headHash, prNumber } = githubPatchData || {};

  const {
    branch,
    id: projectID,
    identifier: projectIdentifier,
    owner,
    repo,
  } = projectMetadata || {};
  const hasOwnerAndRepo = !!owner && !!repo;

  const isGithubMergePatch = requester === Requester.GitHubMergeQueue;
  const isGitHubPullRequest = requester === Requester.GitHubPR;

  return (
    <MetadataSection title="General">
      <CopyableID textToCopy={id} tooltipLabel="Copy version ID" />
      <MetadataItem label="Project">
        <StyledRouterLink
          onClick={() =>
            sendEvent({ name: "Clicked metadata project patches link" })
          }
          to={getProjectPatchesRoute(projectIdentifier || projectID || "")}
        >
          {projectIdentifier || `${owner}/${repo}`}
        </StyledRouterLink>
      </MetadataItem>
      <MetadataItem label="Submitted by">
        <StyledRouterLink
          data-cy="user-patches-link"
          to={getUserPatchesRoute(user.userId)}
        >
          {user.userId}
        </StyledRouterLink>
      </MetadataItem>
      {isPatch && baseVersion ? (
        <BaseCommitMetadata
          baseVersionId={baseVersion.id}
          isGithubMergePatch={isGithubMergePatch}
          onClick={() =>
            sendEvent({ name: "Clicked metadata base commit link" })
          }
          revision={revision}
        />
      ) : (
        <MetadataItem label="Previous commit">
          <InlineCode
            as={Link}
            data-cy="version-previous-commit"
            onClick={() =>
              sendEvent({ name: "Clicked metadata previous version link" })
            }
            to={getVersionRoute(previousVersion?.id || "")}
          >
            {shortenGithash(previousVersion?.revision || "")}
          </InlineCode>
        </MetadataItem>
      )}
      {isGitHubPullRequest && hasOwnerAndRepo && headHash && prNumber && (
        <MetadataItem label="GitHub PR commit">
          <InlineCode
            data-cy="github-pr-commit"
            href={getGithubPRUrl(owner, repo, prNumber, headHash)}
            onClick={() =>
              sendEvent({ name: "Clicked metadata github commit link" })
            }
          >
            {shortenGithash(headHash)}
          </InlineCode>
        </MetadataItem>
      )}
      {isGithubMergePatch && hasOwnerAndRepo && branch && (
        <MetadataItem>
          <StyledLink
            data-cy="github-merge-queue-link"
            hideExternalIcon={false}
            href={getGithubMergeQueueUrl(owner, repo, branch)}
          >
            GitHub Merge Queue
          </StyledLink>
        </MetadataItem>
      )}
      {!isPatch && hasOwnerAndRepo && revision && (
        <MetadataItem label="GitHub commit">
          <InlineCode
            data-cy="version-github-commit"
            href={getGithubCommitUrl(owner, repo, revision)}
            onClick={() =>
              sendEvent({ name: "Clicked metadata github commit link" })
            }
          >
            {shortenGithash(revision)}
          </InlineCode>
        </MetadataItem>
      )}
      {includedLocalModules && includedLocalModules.length > 0 && (
        <IncludedLocalModules includedLocalModules={includedLocalModules} />
      )}
      {manifest && <ManifestBlob manifest={manifest} />}
      {upstreamProject && (
        <MetadataItem label="Triggered from">
          <StyledRouterLink
            to={getTriggerRoute({
              triggerType: upstreamProject.triggerType,
              upstreamTask: upstreamProject.task,
              upstreamVersion: upstreamProject.version,
              upstreamRevision: upstreamProject.revision,
              upstreamOwner: upstreamProject.owner,
              upstreamRepo: upstreamProject.repo,
            })}
          >
            {upstreamProject.project}
          </StyledRouterLink>
        </MetadataItem>
      )}
      {gitTags && (
        <MetadataItem>
          {gitTags.map((g) => (
            <Disclaimer key={g.tag}>
              Tag {g.tag} pushed by {g.pusher}
            </Disclaimer>
          ))}
        </MetadataItem>
      )}
    </MetadataSection>
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
  const isBaseVersionPending = isGithubMergePatch && !baseVersionId;

  return (
    <MetadataItem label="Base commit">
      {isBaseVersionPending ? (
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
      {isBaseVersionPending && " (pending)"}
    </MetadataItem>
  );
};
