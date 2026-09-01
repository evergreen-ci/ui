import { ComponentPropsWithoutRef, forwardRef } from "react";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { cx } from "@evg-ui/lib/utils/css";
import { statusColorMap } from "./icons";
import styles from "./index.module.css";

const DEFAULT_SQUARE_SIZE = 16;
const SQUARE_BORDER = 1;
export const SQUARE_WITH_BORDER = DEFAULT_SQUARE_SIZE + SQUARE_BORDER * 2;

export { statusColorMap };

interface TaskBoxProps {
  status: TaskStatus;
}

type PolymorphicProps<E extends React.ElementType> = TaskBoxProps & {
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, keyof TaskBoxProps>;

export const taskBoxClassName = styles.taskBox;

export const TaskBox = forwardRef<
  HTMLDivElement,
  PolymorphicProps<React.ElementType>
>(({ as: Component = "div", className, status, ...rest }, ref) => (
  <Component
    ref={ref}
    className={cx(styles.taskBox, className)}
    data-status={status}
    {...rest}
  />
));

TaskBox.displayName = "TaskBox";

export const CollapsedBox = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.collapsedBox, className)} {...rest} />
));
CollapsedBox.displayName = "CollapsedBox";
