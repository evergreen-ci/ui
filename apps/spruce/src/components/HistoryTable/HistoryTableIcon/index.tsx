import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { size, zIndex } from "constants/tokens";
import { TaskStatus } from "types/task";

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
    justify="middle"
    enabled={!inactive && failingTests.length > 0}
    popoverZIndex={zIndex.tooltip}
    trigger={
      <Container
        onClick={() => onClick()}
        data-cy="history-table-icon"
        data-status={status}
        aria-disabled={inactive}
      >
        <IconContainer>
          <TaskStatusIcon status={status} size={30} />
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
        <Skeleton active data-cy="history-tooltip-skeleton" />
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
