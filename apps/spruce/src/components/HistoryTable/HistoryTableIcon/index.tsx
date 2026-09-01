import { Size, Skeleton } from "@leafygreen-ui/skeleton-loader";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
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
}) => (
  <Tooltip
    align="right"
    enabled={!inactive && (loadingTestResults || failingTests.length > 0)}
    justify="middle"
    trigger={
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- pre-existing violation, surfaced by the Emotion conversion
      <div
        aria-disabled={inactive}
        className={styles.container}
        data-testid="history-table-icon"
        onClick={() => onClick()}
      >
        <TaskBox className={styles.taskBox} status={status} />
        {!inactive && <Body>{label}</Body>}
      </div>
    }
    triggerEvent="hover"
  >
    <div data-testid="test-tooltip">
      {failingTests.map((testName) => (
        <div key={testName} className={styles.testName}>
          {testName}
        </div>
      ))}
      {loadingTestResults && (
        <Skeleton data-testid="history-tooltip-skeleton" size={Size.Small} />
      )}
    </div>
  </Tooltip>
);
