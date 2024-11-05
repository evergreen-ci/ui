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
            aria-label="name-change-modal-trigger"
            data-cy="name-change-modal-trigger"
          >
            <Icon glyph="Charts" />
          </IconButton>
        </BtnContainer>
      }
      triggerEvent="click"
    >
      <>
        {taskStatusStats?.counts?.map(({ count, status }) => (
          <Row>
            <Count>{count}</Count>
            <Square status={status as TaskStatus} />
            {taskStatusToCopy[status as TaskStatus]}
          </Row>
        ))}
        <Divider />
        <Row>
          <Count>{totalTaskCount}</Count>
          Total tasks
        </Row>
      </>
    </Tooltip>
  );
};

const BtnContainer = styled.div`
  display: inline-block;
`;

const Row = styled.div`
  align-items: center;
  display: flex;
  gap: ${size.xs};
`;

const Count = styled.span`
  font-feature-settings: "tnum";
  min-width: 3em;
  text-align: right;
`;

const Square = styled.div<{ status: TaskStatus }>`
  ${({ status }) => taskStatusStyleMap[status]}
  height: ${SQUARE_SIZE}px;
  width: ${SQUARE_SIZE}px;
`;
