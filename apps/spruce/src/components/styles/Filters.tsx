import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./Filters.module.css";

export const FiltersWrapper = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.filtersWrapper, className)} {...rest} />
));
FiltersWrapper.displayName = "FiltersWrapper";
