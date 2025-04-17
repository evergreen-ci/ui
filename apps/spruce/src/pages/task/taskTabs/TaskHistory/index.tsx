import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Banner, { Variant as BannerVariant } from "@leafygreen-ui/banner";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
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
import { useSpruceConfig } from "hooks";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParam, useQueryParams } from "hooks/useQueryParam";
import { jiraLinkify } from "utils/string";
import CommitDetailsList from "./CommitDetailsList";
import { ACTIVATED_TASKS_LIMIT } from "./constants";
import TaskTimeline from "./TaskTimeline";
import { TaskHistoryOptions, ViewOptions } from "./types";
import { getNextPageCursor, getPrevPageCursor, groupTasks } from "./utils";

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

  const [queryParams, setQueryParams] = useQueryParams();

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
          "This page is currently under construction, and may have issues in performance and functionality. See DEVPROD-6584 for project details.",
          jiraHost,
        )}
      </Banner>
      <Header>
        <Subtitle>Task History Overview</Subtitle>
        <SegmentedControl
          aria-controls="[data-cy='task-timeline']"
          onChange={(t) => setViewOption(t as ViewOptions)}
          size="xsmall"
          value={viewOption}
        >
          <SegmentedControlOption
            data-cy="collapsed-option"
            value={ViewOptions.Collapsed}
          >
            Collapsed
          </SegmentedControlOption>
          <SegmentedControlOption
            data-cy="expanded-option"
            value={ViewOptions.Expanded}
          >
            Expanded
          </SegmentedControlOption>
        </SegmentedControl>
      </Header>
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
      <Subtitle>Commit Details</Subtitle>
      <CommitDetailsList
        currentTask={task}
        loading={loading}
        tasks={visibleTasks}
      />
    </Container>
  );
};

export default TaskHistory;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.s};

  height: calc(100vh - 100px);
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
