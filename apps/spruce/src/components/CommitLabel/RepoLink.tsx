import { Link } from "@leafygreen-ui/typography";
import { Body } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { getGithubCommitUrl } from "constants/externalResources";
import styles from "./RepoLink.module.css";

interface RepoLinkProps {
  repo?: { owner: string; repo: string } | null;
  revision: string;
  showSeparator?: boolean;
}

export const RepoLink: React.FC<RepoLinkProps> = ({
  repo,
  revision,
  showSeparator = false,
}) => {
  if (!repo) {
    return null;
  }

  return (
    <>
      <Body className={styles.text}>
        <Link
          className={styles.text}
          data-testid="github-link"
          hideExternalIcon
          href={getGithubCommitUrl(repo.owner, repo.repo, revision)}
        >
          <span className={styles.githubIcon}>
            <Icon glyph="GitHub" />
          </span>
          {`in ${repo.owner}/${repo.repo}`}
        </Link>
      </Body>
      {showSeparator && (
        <span aria-hidden data-testid="separator">
          &middot;
        </span>
      )}
    </>
  );
};
