import { useRef } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Skeleton, Size as SkeletonSize } from "@leafygreen-ui/skeleton-loader";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { SQUARE_SIZE, SQUARE_BORDER, TaskBox } from "components/TaskBox";
import { getTaskRoute } from "constants/routes";
import { useDimensions } from "hooks/useDimensions";
import { GroupedTask } from "../types";

const { gray, white } = palette;

export interface TimelineProps {
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
      <IconButton
        aria-label="Previous Page"
        disabled
        onClick={() => {
          console.log("TODO: DEVPROD-16050");
        }}
      >
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
                    status={currTask.displayStatus as TaskStatus}
                    to={getTaskRoute(currTask.id, {
                      execution: currTask.execution,
                    })}
                  />
                );
              } else if (vt.inactiveTasks) {
                return (
                  <CollapsedBox key={vt.inactiveTasks[0].id}>
                    {vt.inactiveTasks.length}
                  </CollapsedBox>
                );
              }
              return null;
            })}
          </>
        )}
      </Timeline>
      <IconButton
        aria-label="Next Page"
        disabled
        onClick={() => {
          console.log("TODO: DEVPROD-16050");
        }}
      >
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

const CollapsedBox = styled.div`
  height: ${SQUARE_SIZE}px;
  width: ${SQUARE_SIZE}px;

  background-color: ${gray.light2};
  border: 1px solid ${white};
  border-radius: ${size.xxs};
  box-sizing: content-box;
  float: left;
  position: relative;
  text-align: center;
`;
