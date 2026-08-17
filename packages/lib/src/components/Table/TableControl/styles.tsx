import { cx } from "../../../utils/css";
import styles from "./styles.module.css";

type DivProps = React.ComponentPropsWithoutRef<"div">;

export const TableControlInnerRow: React.FC<DivProps> = ({
  className,
  ...rest
}) => <div className={cx(styles.innerRow, className)} {...rest} />;

export const TableControlOuterRow: React.FC<DivProps> = ({
  className,
  ...rest
}) => <div className={cx(styles.outerRow, className)} {...rest} />;
