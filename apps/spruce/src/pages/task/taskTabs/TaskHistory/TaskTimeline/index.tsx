import { useRef } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { Skeleton, Size as SkeletonSize } from "@leafygreen-ui/skeleton-loader";
import { Link } from "react-router-dom";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import {
  SQUARE_BORDER,
  SQUARE_SIZE,
  TaskBox as BaseTaskBox,
  CollapsedBox,
} from "components/TaskBox";
import { getTaskRoute } from "constants/routes";
import { useDimensions } from "hooks/useDimensions";
import { TaskTab } from "types/task";
import { GroupedTask } from "../types";

interface TimelineProps {
  groupedTasks: GroupedTask[];
  loading: boolean;
}

const TaskTimeline: React.FC<TimelineProps> = ({ groupedTasks, loading }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useDimensions<HTMLDivElement>(ref);

  const numVisibleTasks = Math.floor(width / (SQUARE_SIZE + SQUARE_BORDER * 2));
  const visibleTasks = groupedTasks.slice(0, numVisibleTasks);

  return (
    <Container>
      <IconButton aria-label="Previous Page" disabled>
        <Icon glyph="ChevronLeft" />
      </IconButton>
      <Timeline ref={ref}>
        {loading ? (
          <Skeleton size={SkeletonSize.Small} />
        ) : (
          <>
            {visibleTasks.map((vt) => {
              if (vt.task) {
                const currTask = vt.task;
                return (
                  <TaskBox
                    key={currTask.id}
                    as={Link}
                    rightmost={false}
                    status={currTask.displayStatus as TaskStatus}
                    to={getTaskRoute(currTask.id, {
                      execution: currTask.execution,
                      tab: TaskTab.History,
                    })}
                  />
                );
              } else if (vt.inactiveTasks) {
                return (
                  <CollapsedBox key={vt.inactiveTasks[0].id} data-collapsed>
                    {vt.inactiveTasks.length}
                  </CollapsedBox>
                );
              }
              return null;
            })}
          </>
        )}
      </Timeline>
      <IconButton aria-label="Next Page" disabled>
        <Icon glyph="ChevronRight" />
      </IconButton>
    </Container>
  );
};

export default TaskTimeline;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${size.xxs};
`;

const Timeline = styled.div`
  width: 100%;
`;

const TaskBox = styled(BaseTaskBox)`
  opacity: 0.5;
  :hover {
    opacity: 1;
  }
`;
