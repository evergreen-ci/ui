import { forwardRef } from "react";
import { Skeleton, SkeletonWrapper } from "@via-ds/components/skeleton";
import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
} from "@via-ds/components/tooltip";
import { Body } from "@via-ds/components/typography";
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
      <Skeleton isLoading>
        <SkeletonWrapper>
          <div className={styles.loadingHeaderBar} />
        </SkeletonWrapper>
      </Skeleton>
    </div>
  ) : (
    <div
      className={cx(styles.baseCell, styles.cell)}
      data-testid="loading-cell"
    >
      <Skeleton isLoading>
        <SkeletonWrapper>
          <div className={styles.loadingIcon} />
        </SkeletonWrapper>
      </Skeleton>
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
      <TooltipRoot align="center" side="top">
        <TooltipTrigger>
          <Body className={styles.mediumWeight} onClick={onClick}>
            {trimmedDisplayName}
          </Body>
        </TooltipTrigger>
        <Tooltip>{fullDisplayName}</Tooltip>
      </TooltipRoot>
    ) : (
      <Body className={styles.mediumWeight} onClick={onClick}>
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
