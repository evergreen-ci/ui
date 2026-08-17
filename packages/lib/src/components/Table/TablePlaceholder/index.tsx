import { cx } from "../../../utils/css";
import Icon, { glyphs } from "../../Icon";
import styles from "./index.module.css";

interface Props {
  message: string | React.ReactNode;
  glyph?: keyof typeof glyphs;
  spin?: boolean;
}

export const TablePlaceholder: React.FC<Props> = ({
  glyph = "CurlyBraces",
  message,
  spin = false,
  ...props
}) => (
  <div className={styles.placeholderWrapper} {...props}>
    <Icon
      className={cx(spin && styles.spinningIcon)}
      glyph={glyph}
      size="large"
    />
    <div>{message}</div>
  </div>
);
