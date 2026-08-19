import { cx } from "../../../utils/css";
import styles from "./constants.module.css";

export const DEFAULT_SPACING = 10;

export const FilterWrapper: React.FC<React.ComponentPropsWithoutRef<"div">> = ({
  className,
  ...rest
}) => <div className={cx(styles.filterWrapper, className)} {...rest} />;
