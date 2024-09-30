import { InlineCode, Disclaimer } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
  MetadataLabel,
} from "components/MetadataCard";
import { StyledLink, StyledRouterLink } from "components/styles";
import {
  getGithubCommitUrl,
  getGithubMergeQueueUrl,
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
import { string } from "utils";
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
    previousVersion,
    projectIdentifier,
    projectMetadata,
    requester,
    revision,
    startTime,
    upstreamProject,
    versionTiming,
  } = version || {};
  const { sendEvent } = useVersionAnalytics(id);
  const { makespan, timeTaken } = versionTiming || {};

  const { branch, owner, repo } = projectMetadata || {};

  const isGithubMergePatch = requester === Requester.GitHubMergeQueue;

  return (
    <MetadataCard loading={loading}>
      <MetadataTitle>
        {isPatch ? "Patch Metadata" : "Version Metadata"}
      </MetadataTitle>

      <MetadataItem>
        <MetadataLabel>Project:</MetadataLabel>{" "}
        {projectIdentifier ? (
          <StyledRouterLink
            onClick={() =>
              sendEvent({ name: "Clicked metadata project patches link" })
            }
            to={getProjectPatchesRoute(projectIdentifier)}
          >
            {projectIdentifier}
          </StyledRouterLink>
        ) : (
          `${owner}/${repo}`
        )}
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Makespan:</MetadataLabel>{" "}
        {makespan && msToDuration(makespan)}
      </MetadataItem>
      <MetadataItem>
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
      {isGithubMergePatch && owner && repo && branch && (
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
      {!isPatch && owner && repo && revision && (
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
