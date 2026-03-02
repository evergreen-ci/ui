import styled from "@emotion/styled";
import { Size, Skeleton } from "@leafygreen-ui/skeleton-loader";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskBox } from "components/TaskBox";
import { VARIANT_HISTORY_SQUARE_SIZE } from "../constants";

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
      <Container
        aria-disabled={inactive}
        data-cy="history-table-icon"
        data-status={status}
        onClick={() => onClick()}
      >
        <IconContainer>
          <TaskBox squareSize={VARIANT_HISTORY_SQUARE_SIZE} status={status} />
        </IconContainer>
        {!inactive && <Body>{label}</Body>}
      </Container>
    }
    triggerEvent="hover"
  >
    <div data-cy="test-tooltip">
      {failingTests.map((testName) => (
        <TestName key={testName}>{testName}</TestName>
      ))}
      {loadingTestResults && (
        <Skeleton data-cy="history-tooltip-skeleton" size={Size.Small} />
      )}
    </div>
  </Tooltip>
);

interface ContainerProps {
  onClick?: () => void;
}
const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ onClick }) => onClick && "cursor: pointer;"}
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TestName = styled.div`
  word-break: break-all;
`;
