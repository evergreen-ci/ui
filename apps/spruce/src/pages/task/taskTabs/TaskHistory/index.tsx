import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Banner, { Variant as BannerVariant } from "@leafygreen-ui/banner";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { SQUARE_WITH_BORDER } from "components/TaskBox";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import {
  TaskHistoryDirection,
  TaskHistoryQuery,
  TaskHistoryQueryVariables,
  TaskQuery,
} from "gql/generated/types";
import { TASK_HISTORY } from "gql/queries";
import { useSpruceConfig, useUserTimeZone } from "hooks";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParam, useQueryParams } from "hooks/useQueryParam";
import { jiraLinkify } from "utils/string";
import CommitDetailsList from "./CommitDetailsList";
import { ACTIVATED_TASKS_LIMIT } from "./constants";
import { Controls } from "./Controls";
import TaskTimeline from "./TaskTimeline";
import { TaskHistoryOptions, ViewOptions } from "./types";
import {
  getNextPageCursor,
  getPrevPageCursor,
  getUTCDate,
  groupTasks,
} from "./utils";

interface TaskHistoryProps {
  task: NonNullable<TaskQuery["task"]>;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ task }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { width: timelineWidth } = useDimensions<HTMLDivElement>(timelineRef);

  const dispatchToast = useToastContext();

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

  const [viewOption, setViewOption] = useState(ViewOptions.Collapsed);
  const shouldCollapse = viewOption === ViewOptions.Collapsed;

  const { buildVariant, displayName: taskName, project } = task;
  const { identifier: projectIdentifier = "" } = project ?? {};

  const [queryParams, setQueryParams] = useQueryParams();

  const [cursorId] = useQueryParam<string>(
    TaskHistoryOptions.CursorID,
    task.id,
  );
  const [direction] = useQueryParam<TaskHistoryDirection>(
    TaskHistoryOptions.Direction,
    TaskHistoryDirection.Before,
  );
  const [includeCursor] = useQueryParam<boolean>(
    TaskHistoryOptions.IncludeCursor,
    true,
  );

  const [date] = useQueryParam<string>(TaskHistoryOptions.Date, "");
  const timezone = useUserTimeZone();
  const utcDate = getUTCDate(date, timezone);

  const { data, loading } = useQuery<
    TaskHistoryQuery,
    TaskHistoryQueryVariables
  >(TASK_HISTORY, {
    variables: {
      options: {
        taskName,
        buildVariant,
        projectIdentifier,
        cursorParams: {
          cursorId,
          direction,
          includeCursor,
        },
        limit: ACTIVATED_TASKS_LIMIT,
        date: utcDate,
      },
    },
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (err) => {
      dispatchToast.error(`Unable to get task history: ${err}`);
    },
  });

  const { taskHistory } = data ?? {};
  const { pagination, tasks = [] } = taskHistory ?? {};
  const { mostRecentTaskOrder, oldestTaskOrder } = pagination ?? {};

  const groupedTasks = groupTasks(tasks, shouldCollapse);
  const numVisibleTasks = Math.floor(timelineWidth / SQUARE_WITH_BORDER);

  const visibleTasks =
    direction === TaskHistoryDirection.After
      ? groupedTasks.slice(-numVisibleTasks)
      : groupedTasks.slice(0, numVisibleTasks);

  const prevPageCursor = getPrevPageCursor(visibleTasks[0]);
  const nextPageCursor = getNextPageCursor(
    visibleTasks[visibleTasks.length - 1],
  );

  // This hook redirects from any page with with the AFTER parameter to the equivalent page using the BEFORE parameter.
  // The reason this is done is because we always want the visible tasks in the timeline to extend or shrink from the
  // right side when a user adjusts their screen size.
  // There may be a way to handle this more elegantly in DEVPROD-16186.
  useEffect(() => {
    if (direction === TaskHistoryDirection.After && prevPageCursor) {
      setQueryParams({
        ...queryParams,
        [TaskHistoryOptions.Direction]: TaskHistoryDirection.Before,
        [TaskHistoryOptions.CursorID]: prevPageCursor.id,
        [TaskHistoryOptions.IncludeCursor]: true,
      });
    }
  }, [direction, setQueryParams, prevPageCursor, queryParams]);

  return (
    <Container>
      <Banner variant={BannerVariant.Info}>
        {jiraLinkify(
          "This page is currently under construction. Performance and functionality bugs may be present. See DEVPROD-6584 for project details.",
          jiraHost,
        )}
      </Banner>
      <StickyHeader>
        <Controls
          date={date}
          setViewOption={setViewOption}
          viewOption={viewOption}
        />
        <TaskTimeline
          ref={timelineRef}
          loading={loading}
          pagination={{
            mostRecentTaskOrder,
            oldestTaskOrder,
            nextPageCursor,
            prevPageCursor,
          }}
          tasks={visibleTasks}
        />
      </StickyHeader>
      <ListContent>
        <Subtitle>Commit Details</Subtitle>
        <CommitDetailsList
          currentTask={task}
          loading={loading}
          tasks={visibleTasks}
        />
      </ListContent>
    </Container>
  );
};

export default TaskHistory;

const Container = styled.div``;

const StickyHeader = styled.div`
  position: sticky;
  top: -${size.m};
  z-index: 1;

  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  background: white;
  padding: ${size.xs} 0;
`;

const ListContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  margin-top: ${size.xxs};
`;
