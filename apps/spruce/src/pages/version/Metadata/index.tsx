import { InlineCode, Disclaimer } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components";
import { shortenGithash } from "@evg-ui/lib/utils";
import { useVersionAnalytics } from "analytics";
import MetadataCard, {
  MetadataItem,
  MetadataLabel,
} from "components/MetadataCard";
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
import { useDateFormat } from "hooks";
import { msToDuration } from "utils/string";
import { ParametersModal } from "../ParametersModal";
import IncludedLocalModules from "./IncludedLocalModules";
import ManifestBlob from "./ManifestBlob";

interface MetadataProps {
  version: NonNullable<VersionQuery["version"]>;
}

export const Metadata: React.FC<MetadataProps> = ({ version }) => {
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
    projectIdentifier,
    projectMetadata,
    requester,
    revision,
    startTime,
    upstreamProject,
    versionTiming,
  } = version;
  const { sendEvent } = useVersionAnalytics(id);
  const { makespan, timeTaken } = versionTiming || {};
  const { githubPatchData, includedLocalModules } = patch || {};
  const { headHash, prNumber } = githubPatchData || {};

  const { branch, id: projectID, owner, repo } = projectMetadata || {};
  const hasOwnerAndRepo = !!owner && !!repo;

  const isGithubMergePatch = requester === Requester.GitHubMergeQueue;
  const isGitHubPullRequest = requester === Requester.GitHubPR;

  return (
    <MetadataCard title={isPatch ? "Patch Metadata" : "Version Metadata"}>
      <MetadataItem>
        <MetadataLabel>Project:</MetadataLabel>{" "}
        <StyledRouterLink
          onClick={() =>
            sendEvent({ name: "Clicked metadata project patches link" })
          }
          to={getProjectPatchesRoute(projectIdentifier || projectID || "")}
        >
          {projectIdentifier || `${owner}/${repo}`}
        </StyledRouterLink>
      </MetadataItem>
      <MetadataItem tooltipDescription="Makespan represents the wall clock time of this version's execution.">
        <MetadataLabel>Makespan:</MetadataLabel>{" "}
        {makespan && msToDuration(makespan)}
      </MetadataItem>
      <MetadataItem tooltipDescription="Time taken represents the total time spent executing tasks for this version.">
        <MetadataLabel>Time taken:</MetadataLabel>{" "}
        {timeTaken && msToDuration(timeTaken)}
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Submitted at:</MetadataLabel>{" "}
        {createTime && (
          <span title={getDateCopy(createTime)}>
            {getDateCopy(createTime, { omitSeconds: true })}
          </span>
        )}
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Started:</MetadataLabel>{" "}
        {startTime && (
          <span title={getDateCopy(startTime)}>
            {getDateCopy(startTime, { omitSeconds: true })}
          </span>
        )}
      </MetadataItem>
      {finishTime && (
        <MetadataItem>
          <MetadataLabel>Finished:</MetadataLabel>{" "}
          <span title={getDateCopy(finishTime)}>
            {getDateCopy(finishTime, { omitSeconds: true })}
          </span>
        </MetadataItem>
      )}
      <MetadataItem>
        <MetadataLabel>Submitted by:</MetadataLabel>{" "}
        <StyledRouterLink
          data-cy="user-patches-link"
          to={getUserPatchesRoute(getAuthorUsername(authorEmail))}
        >
          {author}
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
        <MetadataItem>
          <MetadataLabel>Previous commit:</MetadataLabel>{" "}
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
        <MetadataItem>
          <MetadataLabel>GitHub PR commit:</MetadataLabel>{" "}
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
        <MetadataItem>
          <MetadataLabel>GitHub commit:</MetadataLabel>{" "}
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
        <IncludedLocalModules
          includedLocalModules={includedLocalModules ?? []}
        />
      )}
      {manifest && <ManifestBlob manifest={manifest} />}
      {upstreamProject && (
        <MetadataItem>
          <MetadataLabel>Triggered from:</MetadataLabel>{" "}
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
  const isBaseVersionPending = isGithubMergePatch && !baseVersionId;

  return (
    <MetadataItem>
      <MetadataLabel>Base commit:</MetadataLabel>{" "}
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

const getAuthorUsername = (email: string) => {
  const atIndex = email.indexOf("@");
  return atIndex === -1 ? email : email.substring(0, atIndex);
};
