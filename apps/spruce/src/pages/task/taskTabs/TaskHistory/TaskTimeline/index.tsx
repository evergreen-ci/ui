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
import { useUserTimeZone } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { walkthroughTimelineProps } from "../constants";
import { useTaskHistoryContext } from "../context";
import { GroupedTask, TaskHistoryOptions, TaskHistoryTask } from "../types";
import CurrentTaskBadge, { currentBadgeHoverStyles } from "./CurrentTaskBadge";
import DateSeparator, { dateSeparatorHoverGroupStyles } from "./DateSeparator";

const { blue, gray, white } = palette;

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
    const timezone = useUserTimeZone();
    const {
      mostRecentTaskOrder,
      nextPageCursor,
      oldestTaskOrder,
      prevPageCursor,
    } = pagination;

    const { currentTask, hoveredTask, selectedTask, setSelectedTask } =
      useTaskHistoryContext();

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
                [TaskHistoryOptions.Date]: undefined,
                [TaskHistoryOptions.CursorID]: prevPageCursor.id,
                [TaskHistoryOptions.Direction]: TaskHistoryDirection.After,
                [TaskHistoryOptions.IncludeCursor]: false,
              });
            }
          }}
        >
          <Icon glyph="ChevronLeft" />
        </IconButton>
        <Timeline
          ref={ref}
          data-cy="task-timeline"
          {...walkthroughTimelineProps}
        >
          {loading ? (
            <Skeleton size={SkeletonSize.Small} />
          ) : (
            <>
              {tasks.map((t) => {
                const { commitCardRef, date, inactiveTasks, task } = t;
                if (date) {
                  return (
                    <DateSeparator
                      key={`timeline-date-separator-${date}`}
                      date={date}
                      timezone={timezone}
                    />
                  );
                } else if (task) {
                  const isHoveredTask = hoveredTask === task.id;
                  const isSelectedTask = selectedTask === task.id;
                  return (
                    <TaskBoxWrapper key={task.id} className="square">
                      <TaskBox
                        active={isHoveredTask || isSelectedTask}
                        data-cy="timeline-box"
                        id={`task-box-${task.id}`}
                        onClick={() => {
                          if (isSelectedTask) {
                            setSelectedTask(null);
                          } else {
                            setSelectedTask(task.id);
                            commitCardRef.current?.scrollIntoView();
                          }
                        }}
                        rightmost={false}
                        status={task.displayStatus as TaskStatus}
                        taskId={task.id}
                      />
                      <CurrentTaskBadge
                        isCurrentTask={currentTask.id === task.id}
                      />
                    </TaskBoxWrapper>
                  );
                } else if (inactiveTasks) {
                  return (
                    <CollapsedBox
                      key={inactiveTasks[0].id}
                      className="square"
                      data-cy="collapsed-box"
                    >
                      {inactiveTasks.length}
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
                [TaskHistoryOptions.Date]: undefined,
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

const TaskBoxWrapper = styled.div`
  position: relative;
  ${currentBadgeHoverStyles};
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${size.xxs};
  border-radius: ${size.xs};
  border: 1px solid ${gray.light2};
  padding-top: ${size.l};
  padding-bottom: ${size.xs};

  ${dateSeparatorHoverGroupStyles}
`;

const Timeline = styled.div`
  display: flex;
  flex: 1;
`;

const TaskBox = styled(BaseTaskBox)<{
  active: boolean;
  taskId: string;
}>`
  opacity: 0.5;

  ${({ active }) =>
    active &&
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
