import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { IconSkeleton, Skeleton, Size } from "@leafygreen-ui/skeleton-loader";
import { Align, Justify, Tooltip, TriggerEvent } from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import ConditionalWrapper from "@evg-ui/lib/components/ConditionalWrapper";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { inactiveElementStyle } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
import { COLUMN_LABEL_WIDTH, ROW_LABEL_WIDTH } from "../constants";
import { HistoryTableIcon } from "../HistoryTableIcon";

const { gray } = palette;
const statusIconSize = 20;

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
  <Cell
    aria-disabled={inactive}
    data-cy="task-cell"
    inactive={inactive}
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
  </Cell>
);

const EmptyCell = () => (
  <Cell data-cy="empty-cell">
    <Circle />
  </Cell>
);

interface LoadingCellProps {
  isHeader?: boolean;
}
const LoadingCell: React.FC<LoadingCellProps> = ({ isHeader = false }) =>
  isHeader ? (
    <HeaderCell data-cy="loading-header-cell">
      <Skeleton size={Size.Small} />
    </HeaderCell>
  ) : (
    <Cell data-cy="loading-cell">
      <IconSkeleton />
    </Cell>
  );

interface ColumnHeaderCellProps {
  trimmedDisplayName: string;
  fullDisplayName: string;
  onClick?: () => void;
}

const tooltipWrapper = (children: React.ReactNode, fullDisplayName: string) => (
  <Tooltip
    align={Align.Top}
    justify={Justify.Middle}
    trigger={children as JSX.Element}
    triggerEvent={TriggerEvent.Hover}
  >
    {fullDisplayName}
  </Tooltip>
);

const ColumnHeaderCell: React.FC<ColumnHeaderCellProps> = ({
  fullDisplayName,
  onClick,
  trimmedDisplayName,
}) => (
  <HeaderCell data-cy="header-cell">
    <ConditionalWrapper
      condition={trimmedDisplayName !== fullDisplayName}
      wrapper={(children) => tooltipWrapper(children, fullDisplayName)}
    >
      <Body onClick={onClick} weight="medium">
        {trimmedDisplayName}
      </Body>
    </ConditionalWrapper>
  </HeaderCell>
);

const Circle = styled.div`
  width: ${statusIconSize}px;
  height: ${statusIconSize}px;
  border-radius: 50%;
  border: 2px solid ${gray.light1};
  margin: 0 auto;
`;

const BaseCell = styled.div`
  display: flex;
  height: 100%;
  width: ${COLUMN_LABEL_WIDTH}px;
  margin: 0 ${size.xs};
  justify-content: center;
`;

const Cell = styled(BaseCell)<{ inactive?: boolean }>`
  align-items: center;
  ${({ inactive }) => inactive && inactiveElementStyle}
`;

const HeaderCell = styled(BaseCell)`
  word-break: break-all; // Safari
  word-wrap: anywhere;
  text-align: center;
  height: ${size.xxl};
  padding: ${size.xs} 0;
`;

// LabelCellContainer is used to provide padding for the first column in the table since we do not have a header for it
const LabelCellContainer = styled.div`
  width: ${ROW_LABEL_WIDTH}px;
  margin-right: 40px;
`;

export {
  LabelCellContainer,
  ColumnHeaderCell,
  LoadingCell,
  TaskCell,
  EmptyCell,
};
