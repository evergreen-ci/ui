import { Link, Text } from "@via-ds/components";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import styles from "./RevisionLink.module.css";

interface RevisionLinkProps {
  "data-testid"?: string;
  onClick?: () => void;
  revision: string;
  to: string;
}

export const RevisionLink: React.FC<RevisionLinkProps> = ({
  "data-testid": dataTestId,
  onClick,
  revision,
  to,
}) => (
  <Link
    className={styles.hashLink}
    data-testid={dataTestId}
    href={to}
    onClick={onClick}
  >
    <Text className={styles.hash} textStyle="inlineCode">
      {shortenGithash(revision)}
    </Text>
  </Link>
);
