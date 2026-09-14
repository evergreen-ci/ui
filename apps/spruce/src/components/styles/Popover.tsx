import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./Popover.module.css";

export const PopoverContainer = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.popoverContainer, className)} {...rest} />
));
PopoverContainer.displayName = "PopoverContainer";
