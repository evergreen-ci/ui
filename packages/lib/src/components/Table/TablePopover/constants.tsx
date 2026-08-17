import styles from "./constants.module.css";

export const DEFAULT_SPACING = 10;

export const FilterWrapper: React.FC<React.ComponentPropsWithoutRef<"div">> = (
  props,
) => <div className={styles.filterWrapper} {...props} />;
