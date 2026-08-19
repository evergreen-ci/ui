import { cx } from "../../utils/css";
import styles from "./Typography.module.css";

export const wordBreakCss = `
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  word-break: normal;
  overflow-wrap: anywhere;
`;

type WordBreakProps = React.ComponentPropsWithoutRef<"span"> & {
  all?: boolean;
};

export const WordBreak: React.FC<WordBreakProps> = ({
  all = false,
  className,
  ...rest
}) => (
  <span
    className={cx(styles.wordBreak, all && styles.breakAll, className)}
    {...rest}
  />
);
