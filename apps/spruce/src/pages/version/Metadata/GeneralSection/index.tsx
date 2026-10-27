import { Disclaimer, InlineCode } from "@leafygreen-ui/typography";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useVersionAnalytics } from "analytics";
import { CopyableID } from "components/CopyableID";
import { GithubCommitLink } from "components/GithubCommitLink";
import { MetadataItem, MetadataSection } from "components/MetadataCard";
import { RevisionLink } from "components/RevisionLink";
import {
  getGithubCommitUrl,
  getGithubMergeQueueUrl,
  getGithubPRUrl,
} from "constants/externalResources";
import { Requester } from "constants/requesters";
import {
  getUserPatchesRoute,
  getVersionRoute,
  getWaterfallRoute,
} from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import BaseCommitMetadata from "./BaseCommitMetadata";
import IncludedLocalModules from "./IncludedLocalModules";
import ManifestBlob from "./ManifestBlob";
import UpstreamProject from "./UpstreamProject";

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
    <MetadataSection>
      <CopyableID textToCopy={id} tooltipLabel="Copy version ID" />

      <MetadataItem label="Submitted by">
        <StyledRouterLink
          data-testid="user-patches-link"
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
        <MetadataItem label="Previous version">
          <RevisionLink
            data-testid="version-previous-commit"
            onClick={() =>
              sendEvent({ name: "Clicked metadata previous version link" })
            }
            revision={previousVersion?.revision || ""}
            to={getVersionRoute(previousVersion?.id || "")}
          />
        </MetadataItem>
      )}
      {isGitHubPullRequest && hasOwnerAndRepo && headHash && prNumber && (
        <MetadataItem label="GitHub PR commit">
          <InlineCode
            data-testid="github-pr-commit"
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
            data-testid="github-merge-queue-link"
            hideExternalIcon={false}
            href={getGithubMergeQueueUrl(owner, repo, branch)}
          >
            GitHub Merge Queue
          </StyledLink>
        </MetadataItem>
      )}

      <MetadataSection title="Source">
        <MetadataItem label="Project">
          <StyledRouterLink
            onClick={() =>
              sendEvent({ name: "Clicked metadata waterfall link" })
            }
            to={getWaterfallRoute(projectIdentifier || projectID || "")}
          >
            {projectIdentifier || `${owner}/${repo}`}
          </StyledRouterLink>
        </MetadataItem>
        <MetadataItem label="Repo">
          {owner}/{repo}
        </MetadataItem>
        {!isPatch && hasOwnerAndRepo && revision && (
          <MetadataItem label="GitHub commit">
            <GithubCommitLink
              data-testid="version-github-commit"
              href={getGithubCommitUrl(owner, repo, revision)}
              onClick={() =>
                sendEvent({ name: "Clicked metadata github commit link" })
              }
              revision={revision}
            />
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
        {manifest && <ManifestBlob manifest={manifest} />}
        {includedLocalModules && includedLocalModules.length > 0 && (
          <IncludedLocalModules includedLocalModules={includedLocalModules} />
        )}
      </MetadataSection>

      {upstreamProject && (
        <UpstreamProject upstreamProject={upstreamProject} versionId={id} />
      )}
    </MetadataSection>
  );
};
