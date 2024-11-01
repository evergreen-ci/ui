import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import Tooltip from "@leafygreen-ui/tooltip";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import Icon from "components/Icon";
import { Divider } from "components/styles";
import { size } from "constants/tokens";
import { WaterfallVersionFragment } from "gql/generated/types";
import { statusColorMap } from "./icons";
import { columnBasis, SQUARE_SIZE } from "./styles";
import { VersionLabel } from "./VersionLabel";

export const ColumnHeader: React.FC<WaterfallVersionFragment> = (version) => {
  const totalTaskCount =
    version.taskStatusStats?.counts?.reduce(
      (total, { count }) => total + count,
      0,
    ) ?? 0;

  return (
    <ColumnContainer>
      <VersionLabel size="small" {...version} />
      <Tooltip
        align="right"
        trigger={
          <IconButton
            aria-label="name-change-modal-trigger"
            data-cy="name-change-modal-trigger"
          >
            <Icon glyph="Charts" />
          </IconButton>
        }
        triggerEvent="click"
      >
        <>
          {version.taskStatusStats?.counts?.map(({ count, status }) => (
            <Row>
              <Count>{count}</Count>
              <Square color={statusColorMap[status as TaskStatus]} />
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
    </ColumnContainer>
  );
};

const ColumnContainer = styled.div`
  ${columnBasis}
  display: flex;
  flex-direction: row;
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

const Square = styled.div<{ color: string }>`
  ${({ color }) => `background-color: ${color};`}
  height: ${SQUARE_SIZE}px;
  width: ${SQUARE_SIZE}px;
`;
