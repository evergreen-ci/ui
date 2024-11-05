import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import Tooltip from "@leafygreen-ui/tooltip";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import Icon from "components/Icon";
import { Divider } from "components/styles";
import { size } from "constants/tokens";
import { WaterfallVersionFragment } from "gql/generated/types";
import { SQUARE_SIZE, taskStatusStyleMap } from "./styles";

export const TaskStatsTooltip: React.FC<
  Pick<WaterfallVersionFragment, "taskStatusStats">
> = ({ taskStatusStats }) => {
  const totalTaskCount =
    taskStatusStats?.counts?.reduce((total, { count }) => total + count, 0) ??
    0;

  return (
    <Tooltip
      align="right"
      trigger={
        <BtnContainer>
          <IconButton
            aria-label="Show task stats"
            data-cy="task-stats-tooltip-button"
          >
            <Icon glyph="Charts" />
          </IconButton>
        </BtnContainer>
      }
      triggerEvent="click"
    >
      <Table data-cy="task-stats-tooltip">
        {taskStatusStats?.counts?.map(({ count, status }) => (
          <Row>
            <Count>{count}</Count>
            <Cell>
              <Square status={status as TaskStatus} />
            </Cell>
            <Cell>{taskStatusToCopy[status as TaskStatus]}</Cell>
          </Row>
        ))}
        <Row>
          <Cell colSpan={3}>
            <Divider />
          </Cell>
        </Row>
        <Row>
          <Count>{totalTaskCount}</Count>
          <Cell colSpan={2}>Total tasks</Cell>
        </Row>
      </Table>
    </Tooltip>
  );
};

const BtnContainer = styled.div`
  display: inline-block;
`;

const Table = styled.table``;

const Row = styled.tr``;

const Cell = styled.td`
  padding: 0 ${size.xxs};
`;

const Count = styled(Cell)`
  font-feature-settings: "tnum";
  text-align: right;
`;

const Square = styled.div<{ status: TaskStatus }>`
  ${({ status }) => taskStatusStyleMap[status]}
  height: ${SQUARE_SIZE}px;
  width: ${SQUARE_SIZE}px;
`;
