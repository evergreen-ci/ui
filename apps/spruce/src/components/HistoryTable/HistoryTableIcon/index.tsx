import styled from "@emotion/styled";
import { Size, Skeleton } from "@leafygreen-ui/skeleton-loader";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskStatusIcon } from "components/TaskStatusIcon";

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
    enabled={!inactive && failingTests.length > 0}
    justify="middle"
    popoverZIndex={zIndex.tooltip}
    trigger={
      <Container
        aria-disabled={inactive}
        data-cy="history-table-icon"
        data-status={status}
        onClick={() => onClick()}
      >
        <IconContainer>
          <TaskStatusIcon size={30} status={status} />
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
  height: ${size.l};
  width: ${size.l};
  text-align: center;
`;

const TestName = styled.div`
  word-break: break-all;
`;
