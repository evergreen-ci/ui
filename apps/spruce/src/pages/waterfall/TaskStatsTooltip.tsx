import { useRef, useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import Popover, { Align } from "@leafygreen-ui/popover";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import Icon from "components/Icon";
import { Divider } from "components/styles";
import { PopoverContainer } from "components/styles/Popover";
import { WaterfallVersionFragment } from "gql/generated/types";
import { useOnClickOutside } from "hooks";
import { SQUARE_SIZE, taskStatusStyleMap } from "./styles";

export const TaskStatsTooltip: React.FC<
  Pick<WaterfallVersionFragment, "taskStatusStats">
> = ({ taskStatusStats }) => {
  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([buttonRef, popoverRef], () => setOpen(false));

  const totalTaskCount =
    taskStatusStats?.counts?.reduce((total, { count }) => total + count, 0) ??
    0;

  return (
    <>
      <BtnContainer>
        <IconButton
          ref={buttonRef}
          active={open}
          aria-label="Show task stats"
          data-cy="task-stats-tooltip-button"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon glyph="Charts" />
        </IconButton>
      </BtnContainer>
      <Popover
        ref={popoverRef}
        active={open}
        align={Align.Right}
        popoverZIndex={zIndex.popover}
        refEl={buttonRef}
      >
        <PopoverContainer data-cy="task-stats-tooltip">
          <Table>
            {taskStatusStats?.counts?.map(({ count, status }) => (
              <Row key={`task_stats_row_${status}`}>
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
        </PopoverContainer>
      </Popover>
    </>
  );
};

const BtnContainer = styled.div`
  align-self: flex-start;
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
