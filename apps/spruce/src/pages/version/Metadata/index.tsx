import { useState } from "react";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { InlineCode, Disclaimer } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useVersionAnalytics } from "analytics";
import { CopyableID } from "components/CopyableID";
import { CostModal } from "components/CostModal";
import MetadataCard, {
  MetadataItem,
  MetadataTitleWithAPILink,
} from "components/MetadataCard";
import {
  getAPIRouteForVersions,
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
import { formatCost } from "utils/numbers";
import { msToDuration } from "utils/string";
import { ParametersModal } from "../ParametersModal";
import IncludedLocalModules from "./IncludedLocalModules";
import ManifestBlob from "./ManifestBlob";

interface MetadataProps {
  version: NonNullable<VersionQuery["version"]>;
}

export const Metadata: React.FC<MetadataProps> = ({ version }) => {
  const getDateCopy = useDateFormat();
  const [costModalOpen, setCostModalOpen] = useState(false);
  const {
    baseVersion,
    cost,
    createTime,
    externalLinksForMetadata,
    finishTime,
    gitTags,
    id,
    isPatch,
    manifest,
    message,
    parameters,
    patch,
    previousVersion,
    projectMetadata,
    requester,
    revision,
    startTime,
    upstreamProject,
    user,
    versionTiming,
  } = version;
  const { sendEvent } = useVersionAnalytics(id);
  const totalCost = isPatch ? patch?.cost?.total : cost?.total;
  const isVersionComplete = !!finishTime;
  const hasChildPatches = (patch?.childPatches?.length ?? 0) > 0;
  const costTooltip = getCostTooltip(isVersionComplete, hasChildPatches);
  const { makespan, timeTaken } = versionTiming || {};
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
    <>
      <MetadataCard
        title={
          <MetadataTitleWithAPILink
            href={getAPIRouteForVersions(id)}
            title={isPatch ? "Patch Metadata" : "Version Metadata"}
          />
        }
      >
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
        <MetadataItem
          label="Makespan"
          tooltipDescription="Makespan represents the wall clock time of this version's execution."
        >
          {makespan && msToDuration(makespan)}
        </MetadataItem>
        <MetadataItem
          label="Time taken"
          tooltipDescription="Time taken represents the total time spent executing tasks for this version."
        >
          {timeTaken && msToDuration(timeTaken)}
        </MetadataItem>
        <MetadataItem label="Submitted at">
          {createTime && (
            <span title={getDateCopy(createTime)}>
              {getDateCopy(createTime, { omitSeconds: true })}
            </span>
          )}
        </MetadataItem>
        <MetadataItem label="Started">
          {startTime && (
            <span title={getDateCopy(startTime)}>
              {getDateCopy(startTime, { omitSeconds: true })}
            </span>
          )}
        </MetadataItem>
        {finishTime && (
          <MetadataItem label="Finished">
            <span title={getDateCopy(finishTime)}>
              {getDateCopy(finishTime, { omitSeconds: true })}
            </span>
          </MetadataItem>
        )}
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
          <IncludedLocalModules
            includedLocalModules={includedLocalModules ?? []}
          />
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
        {startTime && totalCost != null && totalCost > 0 && (
          <MetadataItem
            data-cy="version-metadata-cost"
            label="Cost"
            tooltipDescription={costTooltip}
          >
            ${formatCost(totalCost)}
            {cost != null && isVersionComplete && (
              <>
                {" "}
                <Button
                  data-cy="version-cost-details-button"
                  onClick={() => {
                    sendEvent({ name: "Clicked version cost details button" });
                    setCostModalOpen(true);
                  }}
                  size={ButtonSize.XSmall}
                >
                  Cost Details
                </Button>
              </>
            )}
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
      {cost && costModalOpen && (
        <CostModal
          {...cost}
          childPatchesTotalCost={
            isPatch ? patch?.cost?.childPatchesTotalCost : null
          }
          endTs={finishTime ?? undefined}
          name={message ?? id}
          open={costModalOpen}
          setOpen={setCostModalOpen}
          startTs={startTime ?? undefined}
          total={totalCost ?? cost.total}
          versionId={id}
        />
      )}
    </>
  );
};

const getCostTooltip = (isFinished: boolean, hasChildren: boolean): string => {
  if (isFinished) {
    return hasChildren
      ? "Total cost of all tasks, including child patches."
      : "Total cost of all tasks.";
  }
  return hasChildren
    ? "Estimated cost of completed tasks so far, including child patches."
    : "Estimated cost of completed tasks so far.";
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
