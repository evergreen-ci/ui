import { palette } from "@leafygreen-ui/palette";
import { Link } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { RevisionLink } from "components/RevisionLink";
import {
  getGithubCommitUrl,
  getGithubPRUrl,
} from "constants/externalResources";
import styles from "./GithubCommitLink.module.css";

interface GithubCommitLinkProps {
  "data-testid"?: string;
  onClick?: () => void;
  owner: string;
  prNumber?: number;
  repo: string;
  revision: string;
}

export const GithubCommitLink: React.FC<GithubCommitLinkProps> = ({
  "data-testid": dataTestId,
  onClick,
  owner,
  prNumber,
  repo,
  revision,
}) => (
  <Link
    data-testid={dataTestId}
    hideExternalIcon
    href={
      prNumber
        ? getGithubPRUrl(owner, repo, prNumber, revision)
        : getGithubCommitUrl(owner, repo, revision)
    }
    onClick={onClick}
  >
    <span className={styles.unbreakable}>
      <span className={styles.icon}>
        <Icon fill={palette.black} glyph="GitHub" />
      </span>
      {owner}/
    </span>
    <wbr />
    <span className={styles.unbreakable}>{repo}</span>
    <span className={styles.unbreakable}>
      @<RevisionLink revision={revision} />
    </span>
  </Link>
);
