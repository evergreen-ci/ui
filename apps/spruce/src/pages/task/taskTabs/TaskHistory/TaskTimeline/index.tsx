import { forwardRef } from "react";
import { css } from "@emotion/react";
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
import { areDatesOnSameDay, extractTask } from "../utils";
import DateSeparator from "./DateSeparator";

const { gray } = palette;
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
        <Timeline ref={ref} data-cy="task-timeline">
          {loading ? (
            <Skeleton size={SkeletonSize.Small} />
          ) : (
            <>
              {tasks.map((t, i) => {
                let shouldShowDateSeparator = false;
                if (i === 0) {
                  shouldShowDateSeparator = true;
                } else if (t.task) {
                  const prevGroupedTask = extractTask(tasks[i - 1]);
                  shouldShowDateSeparator = !areDatesOnSameDay(
                    prevGroupedTask?.createTime,
                    t.task.createTime,
                  );
                } else if (t.inactiveTasks) {
                  const prevGroupedTask = extractTask(tasks[i - 1]);
                  shouldShowDateSeparator = !areDatesOnSameDay(
                    prevGroupedTask?.createTime,
                    t.inactiveTasks[0].createTime,
                  );
                }
                if (t.task) {
                  const { task } = t;
                  return (
                    <>
                      {shouldShowDateSeparator && (
                        <DateSeparator date={task.createTime} />
                      )}
                      <TaskBox
                        key={task.id}
                        className="square"
                        data-cy="timeline-box"
                        rightmost={false}
                        status={task.displayStatus as TaskStatus}
                      />
                    </>
                  );
                } else if (t.inactiveTasks) {
                  return (
                    <>
                      {shouldShowDateSeparator && (
                        <DateSeparator date={t.inactiveTasks[0].createTime} />
                      )}
                      <CollapsedBox
                        key={t.inactiveTasks[0].id}
                        className="square"
                        data-cy="collapsed-box"
                      >
                        {t.inactiveTasks.length}
                      </CollapsedBox>
                    </>
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

const dateSeparatorHoverGroupStyles = css`
  .date-separator {
    .date-badge {
      transition: opacity 0.2s ease;
      opacity: 1;
      pointer-events: auto;
    }

    .dot {
      transition: opacity 0.2s ease;
      opacity: 0;
    }

    &:hover .date-badge {
      opacity: 1;
      pointer-events: auto;
    }

    /* If followed closely by another .date-separator (after a .square), hide that one's badge and show dot */
    &:has(+ .square + .date-separator) + .square + .date-separator,
    &:has(+ .square + .square + .date-separator)
      + .square
      + .square
      + .date-separator {
      .date-badge {
        opacity: 0;
        pointer-events: none;
      }

      .dot {
        opacity: 1;
      }

      &:hover {
        .date-badge {
          opacity: 1;
          pointer-events: auto;
        }

        .dot {
          opacity: 0;
        }
      }
    }

    /* When the right-side separator is hovered, apply style to current (left) */
    &:has(+ .square + .date-separator:hover),
    &:has(+ .square + .square + .date-separator:hover) {
      .date-badge {
        opacity: 0;
        pointer-events: none;
      }

      .dot {
        opacity: 1;
      }
    }
  }
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
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const TaskBox = styled(BaseTaskBox)`
  opacity: 0.5;
  :hover {
    opacity: 1;
  }
`;
