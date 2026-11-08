import { Link, Skeleton, Text } from "@via-ds/components";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import styles from "./RevisionLink.module.css";

interface RevisionLinkProps {
  "data-testid"?: string;
  isLoading?: boolean;
  onClick?: () => void;
  revision?: string;
  to?: string;
}

export const RevisionLink: React.FC<RevisionLinkProps> = ({
  "data-testid": dataTestId,
  isLoading = false,
  onClick,
  revision,
  to,
}) => {
  if (isLoading) {
    return (
      <Link className={styles.hashLink} isDisabled>
        <Skeleton isLoading>
          <Text textStyle="inlineCode">000000</Text>
        </Skeleton>
      </Link>
    );
  }

  if (!to) {
    return (
      <Text
        className={styles.hash}
        data-testid={dataTestId}
        textStyle="inlineCode"
      >
        {shortenGithash(revision)}
      </Text>
    );
  }

  return (
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
};
