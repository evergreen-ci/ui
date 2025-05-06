import { forwardRef } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Skeleton, Size as SkeletonSize } from "@leafygreen-ui/skeleton-loader";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskBox as BaseTaskBox, CollapsedBox } from "components/TaskBox";
import { TaskHistoryDirection } from "gql/generated/types";
import { useQueryParams } from "hooks/useQueryParam";
import { GroupedTask, TaskHistoryOptions, TaskHistoryTask } from "../types";

const { blue, white } = palette;

type TaskHistoryPagination = {
  mostRecentTaskOrder: number | undefined;
  oldestTaskOrder: number | undefined;
  nextPageCursor: TaskHistoryTask | null;
  prevPageCursor: TaskHistoryTask | null;
};

interface TimelineProps {
  loading: boolean;
  pagination: TaskHistoryPagination;
  tasks: GroupedTask[];
  setSelectedTask: (v: string | null) => void;
  selectedTask: string | null;
  hoveredTask: string | null;
}

const TaskTimeline = forwardRef<HTMLDivElement, TimelineProps>(
  (
    { hoveredTask, loading, pagination, selectedTask, setSelectedTask, tasks },
    ref,
  ) => {
    const [queryParams, setQueryParams] = useQueryParams();
    const {
      mostRecentTaskOrder,
      nextPageCursor,
      oldestTaskOrder,
      prevPageCursor,
    } = pagination;

    return (
      <Container>
        <IconButton
          aria-label="Previous page"
          disabled={
            loading ||
            !prevPageCursor ||
            !mostRecentTaskOrder ||
            mostRecentTaskOrder <= prevPageCursor.order
          }
          onClick={() => {
            if (prevPageCursor) {
              setQueryParams({
                ...queryParams,
                [TaskHistoryOptions.CursorID]: prevPageCursor.id,
                [TaskHistoryOptions.Direction]: TaskHistoryDirection.After,
                [TaskHistoryOptions.IncludeCursor]: false,
              });
            }
          }}
        >
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
                  const isHoveredTask = hoveredTask === task.id;
                  const isSelectedTask = selectedTask === task.id;
                  return (
                    <TaskBox
                      key={task.id}
                      data-cy="timeline-box"
                      hovered={isHoveredTask}
                      id={`task-box-${task.id}`}
                      onClick={() => {
                        if (isSelectedTask) {
                          setSelectedTask(null);
                        } else {
                          setSelectedTask(task.id);
                          const element = document.getElementById(
                            `commit-card-${task.id}`,
                          );
                          if (element) {
                            element.scrollIntoView({ block: "center" });
                          }
                        }
                      }}
                      rightmost={false}
                      selected={isSelectedTask}
                      status={task.displayStatus as TaskStatus}
                      taskId={task.id}
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
        <IconButton
          aria-label="Next page"
          disabled={
            loading ||
            !nextPageCursor ||
            !oldestTaskOrder ||
            oldestTaskOrder >= nextPageCursor.order
          }
          onClick={() => {
            if (nextPageCursor) {
              setQueryParams({
                ...queryParams,
                [TaskHistoryOptions.CursorID]: nextPageCursor.id,
                [TaskHistoryOptions.Direction]: TaskHistoryDirection.Before,
                [TaskHistoryOptions.IncludeCursor]: false,
              });
            }
          }}
        >
          <Icon glyph="ChevronRight" />
        </IconButton>
      </Container>
    );
  },
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

const TaskBox = styled(BaseTaskBox)<{
  selected: boolean;
  hovered: boolean;
  taskId: string;
}>`
  opacity: 0.5;

  ${({ hovered, selected }) =>
    (selected || hovered) &&
    `
      opacity: 1;
      border: 1px solid ${blue.base};
      box-shadow: 0 0 0 1px ${white} inset;
    `};

  :hover {
    cursor: pointer;
    opacity: 1;
  }
`;
