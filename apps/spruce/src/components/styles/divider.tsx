import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./divider.module.css";

interface DividerProps extends ComponentPropsWithoutRef<"hr"> {
  margin?: string;
}

const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ className, margin, ...rest }, ref) => (
    <hr
      ref={ref}
      className={cx(styles.divider, className)}
      style={margin ? { margin } : undefined}
      {...rest}
    />
  ),
);
Divider.displayName = "Divider";

export { Divider };
