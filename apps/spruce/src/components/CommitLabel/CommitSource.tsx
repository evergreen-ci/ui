import { skipToken, useQuery } from "@apollo/client/react";
import { Link } from "@leafygreen-ui/typography";
import { Body } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { RevisionLink } from "components/RevisionLink";
import { getGithubCommitUrl } from "constants/externalResources";
import { Requester } from "constants/requesters";
import { getTriggerRoute } from "constants/routes";
import {
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import { VERSION_UPSTREAM_PROJECT } from "gql/queries";
import { getDisplayRevision } from "utils/string";
import styles from "./CommitSource.module.css";

interface CommitSourceProps {
  "data-testid"?: string;
  hashHref: string;
  onHashClick?: () => void;
  onModuleClick?: () => void;
  showRepo?: boolean;
  version: {
    id: string;
    projectMetadata?: { owner: string; repo: string } | null;
    requester: string;
    revision: string;
  };
}

export const CommitSource: React.FC<CommitSourceProps> = ({
  "data-testid": dataTestId,
  hashHref,
  onHashClick,
  onModuleClick,
  showRepo = false,
  version,
}) => {
  const { id, projectMetadata, requester, revision } = version;
  const isTrigger = requester === Requester.Trigger;

  const { data } = useQuery<
    VersionUpstreamProjectQuery,
    VersionUpstreamProjectQueryVariables
  >(
    VERSION_UPSTREAM_PROJECT,
    isTrigger ? { variables: { versionId: id } } : skipToken,
  );
  const upstreamProject = data?.version?.upstreamProject;
  const displayRepo = showRepo ? (upstreamProject ?? projectMetadata) : null;
  const displayRevision = getDisplayRevision({ revision, upstreamProject });

  return (
    <div className={styles.container}>
      <RevisionLink
        data-testid={dataTestId}
        onClick={onHashClick}
        revision={displayRevision}
        to={hashHref}
      />
      {displayRepo && (
        <Body className={styles.text}>
          <Link
            className={styles.text}
            data-testid="github-link"
            hideExternalIcon
            href={getGithubCommitUrl(
              displayRepo.owner,
              displayRepo.repo,
              displayRevision,
            )}
          >
            <span className={styles.githubIcon}>
              <Icon glyph="GitHub" />
            </span>
            in {displayRepo.owner}/{displayRepo.repo}
          </Link>
        </Body>
      )}
      {displayRepo && isTrigger && (
        <span aria-hidden data-testid="separator">
          &middot;
        </span>
      )}
      {isTrigger && (
        <Body className={styles.text}>
          Triggered by:{" "}
          {upstreamProject && (
            <StyledRouterLink
              onClick={onModuleClick}
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
          )}
        </Body>
      )}
    </div>
  );
};
