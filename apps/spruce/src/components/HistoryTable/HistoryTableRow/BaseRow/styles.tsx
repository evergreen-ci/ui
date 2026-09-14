import { forwardRef } from "react";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./styles.module.css";

export const LabelCellContainer = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cx(styles.labelCellContainer, className)}
    {...rest}
  />
));
LabelCellContainer.displayName = "LabelCellContainer";

interface RowContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  selected?: boolean;
}

export const RowContainer = forwardRef<HTMLDivElement, RowContainerProps>(
  ({ className, selected, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx(
        styles.rowContainer,
        selected && styles.rowContainerSelected,
        className,
      )}
      {...rest}
    />
  ),
);
RowContainer.displayName = "RowContainer";

export const DashedLine = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.dashedLine, className)} {...rest} />
));
DashedLine.displayName = "DashedLine";
