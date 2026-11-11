import { Link } from "@leafygreen-ui/typography";
import { Body } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { getGithubCommitUrl } from "constants/externalResources";
import { LoadingText } from "./LoadingText";
import styles from "./RepoLink.module.css";

const REPO_PLACEHOLDER = "in evergreen-ci/evergreen";

interface RepoLinkProps {
  isLoading?: boolean;
  repo?: { owner: string; repo: string } | null;
  revision: string;
  showSeparator?: boolean;
}

export const RepoLink: React.FC<RepoLinkProps> = ({
  isLoading = false,
  repo,
  revision,
  showSeparator = false,
}) => {
  const loadedRepo = isLoading ? null : repo;
  if (!isLoading && !loadedRepo) {
    return null;
  }

  return (
    <>
      <Body className={styles.text}>
        <Link
          className={styles.text}
          data-testid="github-link"
          hideExternalIcon
          href={
            loadedRepo
              ? getGithubCommitUrl(loadedRepo.owner, loadedRepo.repo, revision)
              : undefined
          }
        >
          <span className={styles.githubIcon}>
            <Icon glyph="GitHub" />
          </span>
          {loadedRepo ? (
            `in ${loadedRepo.owner}/${loadedRepo.repo}`
          ) : (
            <LoadingText placeholder={REPO_PLACEHOLDER} />
          )}
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
