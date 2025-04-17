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
import { TaskHistoryDirection } from "gql/generated/types";
import { useQueryParams } from "hooks/useQueryParam";
import { TaskTab } from "types/task";
import { GroupedTask, TaskHistoryOptions, TaskHistoryTask } from "../types";

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
}

const TaskTimeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ loading, pagination, tasks }, ref) => {
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

const TaskBox = styled(BaseTaskBox)`
  opacity: 0.5;
  :hover {
    opacity: 1;
  }
`;
