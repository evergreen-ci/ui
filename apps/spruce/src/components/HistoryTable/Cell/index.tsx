import { forwardRef } from "react";
import { IconSkeleton, Size, Skeleton } from "@leafygreen-ui/skeleton-loader";
import { Align, Justify, Tooltip, TriggerEvent } from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { cx } from "@evg-ui/lib/utils/css";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
import { HistoryTableIcon } from "../HistoryTableIcon";
import styles from "./index.module.css";

interface TaskCellProps {
  task: {
    id: string;
    displayStatus: string;
  };
  inactive?: boolean;
  failingTests?: string[];
  label?: string;
  loading?: boolean;
  onClick?: ({ taskStatus }: { taskStatus: string }) => void;
}

const TaskCell: React.FC<TaskCellProps> = ({
  failingTests,
  inactive,
  label,
  loading = false,
  onClick = () => {},
  task,
}) => (
  <div
    aria-disabled={inactive}
    className={cx(styles.baseCell, styles.cell)}
    data-testid="task-cell"
    style={inactive ? { opacity: 0.4, pointerEvents: "none" } : undefined}
    title={taskStatusToCopy[task.displayStatus as TaskStatus]}
  >
    <Link
      onClick={() => {
        onClick({ taskStatus: task.displayStatus });
      }}
      to={getTaskRoute(task.id, {
        tab: TaskTab.History,
      })}
    >
      <HistoryTableIcon
        failingTests={failingTests}
        inactive={inactive}
        label={label}
        loadingTestResults={loading}
        status={task.displayStatus as TaskStatus}
      />
    </Link>
  </div>
);

const EmptyCell = () => (
  <div className={cx(styles.baseCell, styles.cell)} data-testid="empty-cell">
    <div className={styles.emptySquare} />
  </div>
);

interface LoadingCellProps {
  isHeader?: boolean;
}
const LoadingCell: React.FC<LoadingCellProps> = ({ isHeader = false }) =>
  isHeader ? (
    <div
      className={cx(styles.baseCell, styles.headerCell)}
      data-testid="loading-header-cell"
    >
      <Skeleton size={Size.Small} />
    </div>
  ) : (
    <div
      className={cx(styles.baseCell, styles.cell)}
      data-testid="loading-cell"
    >
      <IconSkeleton />
    </div>
  );

interface ColumnHeaderCellProps {
  trimmedDisplayName: string;
  fullDisplayName: string;
  onClick?: () => void;
}

const ColumnHeaderCell: React.FC<ColumnHeaderCellProps> = ({
  fullDisplayName,
  onClick,
  trimmedDisplayName,
}) => (
  <div
    className={cx(styles.baseCell, styles.headerCell)}
    data-testid="header-cell"
  >
    {trimmedDisplayName !== fullDisplayName ? (
      <Tooltip
        align={Align.Top}
        justify={Justify.Middle}
        trigger={
          <Body onClick={onClick} weight="medium">
            {trimmedDisplayName}
          </Body>
        }
        triggerEvent={TriggerEvent.Hover}
      >
        {fullDisplayName}
      </Tooltip>
    ) : (
      <Body onClick={onClick} weight="medium">
        {fullDisplayName}
      </Body>
    )}
  </div>
);

// LabelCellContainer is used to provide padding for the first column in the table since we do not have a header for it
const LabelCellContainer = forwardRef<
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

export {
  LabelCellContainer,
  ColumnHeaderCell,
  LoadingCell,
  TaskCell,
  EmptyCell,
};
