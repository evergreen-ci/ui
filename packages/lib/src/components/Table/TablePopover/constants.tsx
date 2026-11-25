import { cx } from "../../../utils/css";
import styles from "./constants.module.css";

export const FilterWrapper: React.FC<React.ComponentPropsWithoutRef<"div">> = ({
  className,
  ...rest
}) => <div className={cx(styles.filterWrapper, className)} {...rest} />;
