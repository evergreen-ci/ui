import { useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { Popover, Align } from "@leafygreen-ui/popover";
import Icon from "@evg-ui/lib/components/Icon";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { size } from "@evg-ui/lib/constants/tokens";
import { useOnClickOutside } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { Divider } from "components/styles";
import { PopoverContainer } from "components/styles/Popover";
import { TaskBox } from "components/TaskBox";
import {
  WaterfallTaskStatsQuery,
  WaterfallTaskStatsQueryVariables,
} from "gql/generated/types";
import { WATERFALL_TASK_STATS } from "gql/queries";
import { walkthroughSteps, waterfallGuideId } from "./constants";
import { Version } from "./types";

export const TaskStatsTooltip: React.FC<
  Pick<Version, "id"> & {
    isFirstVersion: boolean;
  }
> = ({ id, isFirstVersion }) => {
  const { data, loading } = useQuery<
    WaterfallTaskStatsQuery,
    WaterfallTaskStatsQueryVariables
  >(WATERFALL_TASK_STATS, {
    variables: { versionId: id },
  });

  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([buttonRef, popoverRef], () => setOpen(false));

  const totalTaskCount =
    data?.version?.taskStatusStats?.counts?.reduce(
      (total, { count }) => total + count,
      0,
    ) ?? 0;

  const buttonContainerProps = isFirstVersion
    ? { [waterfallGuideId]: walkthroughSteps[5].targetId }
    : {};

  return (
    <>
      <BtnContainer>
        <IconButton
          ref={buttonRef}
          active={open}
          aria-label="Show task stats"
          data-cy="task-stats-tooltip-button"
          disabled={!data || loading}
          onClick={() => setOpen((o) => !o)}
          {...buttonContainerProps}
        >
          <Icon glyph="Charts" />
        </IconButton>
      </BtnContainer>
      <Popover
        ref={popoverRef}
        active={open}
        align={Align.Right}
        refEl={buttonRef}
      >
        <PopoverContainer data-cy="task-stats-tooltip">
          <Table>
            <Tbody>
              {data?.version?.taskStatusStats?.counts?.map(
                ({ count, status }) => (
                  <Row key={`task_stats_row_${status}`}>
                    <Count>{count}</Count>
                    <Cell>
                      <TaskBox status={status as TaskStatus} />
                    </Cell>
                    <Cell>{taskStatusToCopy[status as TaskStatus]}</Cell>
                  </Row>
                ),
              )}
              <Row>
                <Cell colSpan={3}>
                  <Divider />
                </Cell>
              </Row>
              <Row>
                <Count>{totalTaskCount}</Count>
                <Cell colSpan={2}>Total tasks</Cell>
              </Row>
            </Tbody>
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

const Tbody = styled.tbody``;

const Row = styled.tr``;

const Cell = styled.td`
  padding: 0 ${size.xxs};
`;

const Count = styled(Cell)`
  font-feature-settings: "tnum";
  text-align: right;
`;
