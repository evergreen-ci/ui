import { Link } from "@leafygreen-ui/typography";
import { Body } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { cx } from "@evg-ui/lib/utils/css";
import { RevisionLink } from "components/RevisionLink";
import { getGithubCommitUrl } from "constants/externalResources";
import { getTriggerRoute } from "constants/routes";
import { VersionTriggerInfoFragment } from "gql/generated/types";
import { getDisplayRevision } from "utils/string";
import styles from "./CommitSource.module.css";

interface CommitSourceProps {
  "data-testid"?: string;
  hashHref: string;
  onHashClick?: () => void;
  onModuleClick?: () => void;
  showRepo?: boolean;
  version: Pick<VersionTriggerInfoFragment, "upstreamProject"> & {
    projectMetadata?: { owner: string; repo: string } | null;
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
  const { projectMetadata, revision, upstreamProject } = version;
  const displayRevision = getDisplayRevision({ revision, upstreamProject });
  const repo = upstreamProject ?? projectMetadata;

  return (
    <div className={styles.container}>
      <RevisionLink
        data-testid={dataTestId}
        onClick={onHashClick}
        revision={displayRevision}
        to={hashHref}
      />
      {showRepo && repo && (
        <Body className={cx(styles.text, styles.repoText)}>
          <Link
            data-testid="github-link"
            hideExternalIcon
            href={getGithubCommitUrl(repo.owner, repo.repo, displayRevision)}
          >
            <span className={styles.repoLink}>
              <Icon glyph="GitHub" />
              {`in ${repo.owner}/${repo.repo}`}
            </span>
          </Link>
        </Body>
      )}
      {showRepo && repo && upstreamProject && (
        <span aria-hidden data-testid="separator">
          &middot;
        </span>
      )}
      {upstreamProject && (
        <Body className={styles.text}>
          Triggered by:{" "}
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
        </Body>
      )}
    </div>
  );
};
