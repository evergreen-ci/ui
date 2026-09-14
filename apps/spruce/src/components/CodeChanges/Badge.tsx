import { Badge as LGBadge } from "@leafygreen-ui/badge";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./Badge.module.css";

interface Props {
  additions: number;
  deletions: number;
}

export const Badge: React.FC<Props> = ({ additions, deletions }) => (
  <LGBadge>
    <FileDiffText type="+" value={additions} />
    <FileDiffText type="-" value={deletions} />
  </LGBadge>
);

interface FileDiffTextProps {
  type: string;
  value: number;
}

export const FileDiffText: React.FC<FileDiffTextProps> = ({ type, value }) => {
  const hasValue = value > 0;
  return (
    <span
      className={cx(
        styles.fileDiffText,
        hasValue && (type === "+" ? styles.addition : styles.deletion),
      )}
    >
      {hasValue && type}
      {value}
    </span>
  );
};
