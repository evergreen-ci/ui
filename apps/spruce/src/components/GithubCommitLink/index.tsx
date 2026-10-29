import { palette } from "@leafygreen-ui/palette";
import { Link } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import styles from "./GithubCommitLink.module.css";

interface GithubCommitLinkProps {
  "data-testid"?: string;
  href: string;
  onClick?: () => void;
  revision: string;
}

export const GithubCommitLink: React.FC<GithubCommitLinkProps> = ({
  "data-testid": dataTestId,
  href,
  onClick,
  revision,
}) => (
  <Link data-testid={dataTestId} hideExternalIcon href={href} onClick={onClick}>
    <span className={styles.link}>
      <Icon fill={palette.black} glyph="GitHub" />
      {shortenGithash(revision)}
    </span>
  </Link>
);
