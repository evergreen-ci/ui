import { forwardRef } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { Skeleton, Size as SkeletonSize } from "@leafygreen-ui/skeleton-loader";
import { Link } from "react-router-dom";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskBox as BaseTaskBox, CollapsedBox } from "components/TaskBox";
import { getTaskRoute } from "constants/routes";
import { TaskTab } from "types/task";
import { GroupedTask } from "../types";

interface TimelineProps {
  tasks: GroupedTask[];
  loading: boolean;
}

const TaskTimeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ loading, tasks }, ref) => (
    <Container>
      <IconButton aria-label="Previous Page" disabled>
        <Icon glyph="ChevronLeft" />
      </IconButton>
      <Timeline ref={ref} data-cy="task-timeline">
        {loading ? (
          <Skeleton size={SkeletonSize.Small} />
        ) : (
          <>
            {tasks.map((t) => {
              if (t.task) {
                const { task } = t;
                return (
                  <TaskBox
                    key={task.id}
                    as={Link}
                    data-cy="timeline-box"
                    rightmost={false}
                    status={task.displayStatus as TaskStatus}
                    to={getTaskRoute(task.id, {
                      execution: task.execution,
                      tab: TaskTab.History,
                    })}
                  />
                );
              } else if (t.inactiveTasks) {
                return (
                  <CollapsedBox
                    key={t.inactiveTasks[0].id}
                    data-cy="collapsed-box"
                  >
                    {t.inactiveTasks.length}
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
  ),
);

TaskTimeline.displayName = "TaskTimeline";

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
