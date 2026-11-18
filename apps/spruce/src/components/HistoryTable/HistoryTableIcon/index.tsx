import { Skeleton, SkeletonWrapper } from "@via-ds/components/skeleton";
import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
} from "@via-ds/components/tooltip";
import { Body } from "@via-ds/components/typography";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskBox } from "components/TaskBox";
import styles from "./index.module.css";

interface HistoryTableIconProps {
  status: TaskStatus;
  label?: string;
  failingTests?: string[];
  inactive?: boolean;
  loadingTestResults?: boolean;
  onClick?: () => void;
}

export const HistoryTableIcon: React.FC<HistoryTableIconProps> = ({
  failingTests = [],
  inactive,
  label,
  loadingTestResults,
  onClick = () => {},
  status,
}) => {
  const showTooltip =
    !inactive && (!!loadingTestResults || failingTests.length > 0);

  return (
    <TooltipRoot align="center" isDisabled={!showTooltip} side="right">
      <TooltipTrigger>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- pre-existing violation, surfaced by the Emotion conversion */}
        <div
          aria-disabled={inactive}
          className={styles.container}
          data-testid="history-table-icon"
          onClick={() => onClick()}
        >
          <TaskBox className={styles.taskBox} status={status} />
          {!inactive && <Body>{label}</Body>}
        </div>
      </TooltipTrigger>
      <Tooltip>
        <div data-testid="test-tooltip">
          {failingTests.map((testName) => (
            <div key={testName} className={styles.testName}>
              {testName}
            </div>
          ))}
          {loadingTestResults && (
            <Skeleton isLoading>
              <SkeletonWrapper>
                <div
                  className={styles.tooltipSkeleton}
                  data-testid="history-tooltip-skeleton"
                />
              </SkeletonWrapper>
            </Skeleton>
          )}
        </div>
      </Tooltip>
    </TooltipRoot>
  );
};
