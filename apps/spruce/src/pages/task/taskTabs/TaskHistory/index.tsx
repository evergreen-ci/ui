import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Banner, { Variant as BannerVariant } from "@leafygreen-ui/banner";
import { Subtitle } from "@leafygreen-ui/typography";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import { SQUARE_WITH_BORDER } from "components/TaskBox";
import { WalkthroughGuideCueRef } from "components/WalkthroughGuideCue";
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
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { useQueryParam, useQueryParams } from "hooks/useQueryParam";
import { isProduction } from "utils/environmentVariables";
import { jiraLinkify } from "utils/string";
import { validateRegexp } from "utils/validators";
import CommitDetailsList from "./CommitDetailsList";
import { ACTIVATED_TASKS_LIMIT } from "./constants";
import { TaskHistoryContextProvider } from "./context";
import { Controls } from "./Controls";
import OnboardingTutorial from "./OnboardingTutorial";
import TaskTimeline from "./TaskTimeline";
import { DATE_SEPARATOR_WIDTH } from "./TaskTimeline/DateSeparator";
import { TestFailureSearchInput } from "./TestFailureSearchInput";
import { TaskHistoryOptions, ViewOptions } from "./types";
import {
  getNextPageCursor,
  getPrevPageCursor,
  getUTCEndOfDay,
  groupTasks,
} from "./utils";

interface TaskHistoryProps {
  task: NonNullable<TaskQuery["task"]>;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ task }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { width: timelineWidth } = useDimensions<HTMLDivElement>(timelineRef);

  const guideCueRef = useRef<WalkthroughGuideCueRef>(null);

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);
  useIntersectionObserver(headerScrollRef, ([entry]) => {
    setShowShadow(!entry.isIntersecting);
  });

  const dispatchToast = useToastContext();

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

  const [viewOption, setViewOption] = useState(ViewOptions.Collapsed);
  const shouldCollapse = viewOption === ViewOptions.Collapsed;

  const { buildVariant, displayName: taskName, project } = task;
  const { identifier: projectIdentifier = "" } = project ?? {};

  const [queryParams, setQueryParams] = useQueryParams();
  const [failingTest] = useQueryParam<string>(
    TaskHistoryOptions.FailingTest,
    "",
  );

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
  const utcDate = getUTCEndOfDay(date, timezone);

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
    fetchPolicy: "cache-first",
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (err) => {
      dispatchToast.error(`Unable to get task history: ${err}`);
    },
  });

  const { taskHistory } = data ?? {};
  const { pagination, tasks = [] } = taskHistory ?? {};
  const { mostRecentTaskOrder, oldestTaskOrder } = pagination ?? {};

  const testFailureSearchTerm = failingTest
    ? new RegExp(
        validateRegexp(failingTest) ? failingTest : toEscapedRegex(failingTest),
        "i",
      )
    : null;

  const groupedTasks = groupTasks(tasks, {
    shouldCollapse,
    timezone,
    testFailureSearchTerm,
  });

  const numVisibleTasks = Math.floor(
    timelineWidth / Math.max(SQUARE_WITH_BORDER, DATE_SEPARATOR_WIDTH),
  );

  const visibleTasks =
    direction === TaskHistoryDirection.After
      ? // Add 1 to exclude the first date that is always present.
        groupedTasks.slice(-numVisibleTasks + 1)
      : groupedTasks.slice(0, numVisibleTasks);

  const prevPageCursor = getPrevPageCursor(visibleTasks);
  const nextPageCursor = getNextPageCursor(visibleTasks);

  const numMatchingResults = useMemo(
    () => visibleTasks.reduce((acc, t) => (t.isMatching ? acc + 1 : acc), 0),
    [visibleTasks],
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
    <TaskHistoryContextProvider task={task}>
      <Container>
        <Banner variant={BannerVariant.Info}>
          {jiraLinkify(
            "This page is currently under construction. Performance and functionality bugs may be present. See DEVPROD-6584 for project details.",
            jiraHost,
          )}
        </Banner>
        <div ref={headerScrollRef} data-header-observer />
        <StickyHeader showShadow={showShadow}>
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
          <TestFailureSearchInput numMatchingResults={numMatchingResults} />
        </StickyHeader>
        <ListContent>
          <Subtitle>Commit Details</Subtitle>
          <CommitDetailsList loading={loading} tasks={visibleTasks} />
        </ListContent>
      </Container>
      {/* Remove blocking condition in DEVPROD-17669 */}
      {!isProduction() && <OnboardingTutorial guideCueRef={guideCueRef} />}
    </TaskHistoryContextProvider>
  );
};

export default TaskHistory;

const Container = styled.div``;

const StickyHeader = styled.div<{ showShadow: boolean }>`
  position: sticky;
  top: -${size.m};
  z-index: 1;

  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  background: white;
  padding: ${size.xs} 0;

  margin: 0 -${size.xs};
  padding: ${size.xs} ${size.xs};

  ${({ showShadow }) =>
    showShadow
      ? "box-shadow: 0 3px 4px -4px rgba(0, 0, 0, 0.6);"
      : "box-shadow: unset;"}
  transition: box-shadow ${transitionDuration.default}ms ease-in-out;
`;

const ListContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  margin-top: ${size.xxs};
`;
