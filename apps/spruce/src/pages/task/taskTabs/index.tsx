import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { Variant } from "@leafygreen-ui/badge";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useTaskAnalytics } from "analytics";
import { TrendChartsPlugin } from "components/PerfPlugin";
import { StyledTabs } from "components/styles/StyledTabs";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { getTaskRoute, GetTaskRouteOptions, slugs } from "constants/routes";
import {
  TaskPerfPluginEnabledQuery,
  TaskPerfPluginEnabledQueryVariables,
  TaskQuery,
  TaskTestCountQuery,
  TaskTestCountQueryVariables,
} from "gql/generated/types";
import { TASK_PERF_PLUGIN_ENABLED, TASK_TEST_COUNT } from "gql/queries";
import { useTabShortcut } from "hooks/useTabShortcut";
import { TaskTab } from "types/task";
import BuildBaron, { useBuildBaronVariables } from "./buildBaronAndAnnotations";
import ExecutionTasksTable from "./ExecutionTasksTable";
import ExecutionTasksTiming from "./ExecutionTasksTiming";
import FileTable from "./FileTable";
import Logs from "./logs";
import TaskHistory from "./TaskHistory";
import { walkthroughHistoryTabProps } from "./TaskHistory/constants";
import TestsTable from "./testsTable/TestsTable";
import { getDefaultTab } from "./utils/getDefaultTab";

interface TaskTabProps {
  isDisplayTask: boolean;
  task: NonNullable<TaskQuery["task"]>;
}

const useTabConfig = (
  task: NonNullable<TaskQuery["task"]>,
  taskTestCountData: TaskTestCountQuery["task"],
  taskPerfPluginEnabledData: TaskPerfPluginEnabledQuery["task"],
  isDisplayTask: boolean,
) => {
  const { failedTestCount } = taskTestCountData || {};
  const { isPerfPluginEnabled } = taskPerfPluginEnabledData || {};
  const {
    annotation,
    baseTask,
    canModifyAnnotation,
    displayName,
    displayStatus,
    execution,
    executionTasksFull,
    files,
    id,
    logs: logLinks,
    versionMetadata,
  } = task;
  const baseTaskId = baseTask?.id || "";
  const { fileCount } = files ?? {};

  const { showBuildBaron } = useBuildBaronVariables({
    task: {
      id,
      execution,
      status: displayStatus,
      canModifyAnnotation,
      hasAnnotation: !!annotation,
    },
  });

  const tabIsActive: Record<TaskTab, boolean> = {
    [TaskTab.Logs]: !isDisplayTask,
    [TaskTab.ExecutionTasks]: isDisplayTask,
    [TaskTab.Tests]: true,
    [TaskTab.Files]: true,
    [TaskTab.Annotations]: showBuildBaron,
    [TaskTab.TrendCharts]: !!isPerfPluginEnabled,
    [TaskTab.History]: true,
    [TaskTab.ExecutionTasksTiming]:
      isDisplayTask && !!executionTasksFull && executionTasksFull.length > 0,
  };

  const tabMap: Record<TaskTab, React.JSX.Element> = {
    [TaskTab.Logs]: (
      <Tab key="task-logs-tab" data-cy="task-logs-tab" name="Logs">
        <Logs execution={execution} logLinks={logLinks} taskId={id} />
      </Tab>
    ),
    [TaskTab.Tests]: (
      <Tab
        key="task-tests-tab"
        data-cy="task-tests-tab"
        name={
          failedTestCount ? (
            <TabLabelWithBadge
              badgeText={failedTestCount}
              badgeVariant={Variant.Red}
              dataCyBadge="tests-tab-badge"
              tabLabel="Tests"
            />
          ) : (
            "Tests"
          )
        }
      >
        <TestsTable task={task} />
      </Tab>
    ),
    [TaskTab.ExecutionTasks]: (
      <Tab
        key="execution-tasks-tab"
        data-cy="task-execution-tab"
        name="Execution Tasks"
      >
        <ExecutionTasksTable
          execution={execution}
          executionTasksFull={executionTasksFull}
          isPatch={versionMetadata?.isPatch}
        />
      </Tab>
    ),
    [TaskTab.Files]: (
      <Tab
        key="task-files-tab"
        data-cy="task-files-tab"
        name={
          fileCount !== undefined ? (
            <TabLabelWithBadge
              badgeText={fileCount}
              badgeVariant={Variant.LightGray}
              dataCyBadge="files-tab-badge"
              tabLabel="Files"
            />
          ) : (
            "Files"
          )
        }
      >
        <FileTable execution={execution} taskId={id} />
      </Tab>
    ),
    [TaskTab.Annotations]: (
      <Tab
        key="task-build-baron-tab"
        data-cy="task-build-baron-tab"
        name="Failure Details"
      >
        <BuildBaron
          /* @ts-expect-error: FIXME. This comment was added by an automated script. */
          annotation={annotation}
          execution={execution}
          taskId={id}
          userCanModify={canModifyAnnotation}
        />
      </Tab>
    ),
    [TaskTab.TrendCharts]: (
      <Tab
        key="trend-charts-tab"
        data-cy="trend-charts-tab"
        name="Trend Charts"
      >
        <TrendChartsPlugin taskId={id} />
      </Tab>
    ),
    [TaskTab.History]: (
      <Tab
        key="task-history-tab"
        data-cy="task-history-tab"
        name="History"
        {...walkthroughHistoryTabProps}
      >
        <TaskHistory baseTaskId={baseTaskId} task={task} />
      </Tab>
    ),
    [TaskTab.ExecutionTasksTiming]: (
      <Tab
        key="execution-tasks-timing-tab"
        data-cy="execution-tasks-timing-tab"
        name="Execution Tasks Timing"
      >
        <ExecutionTasksTiming
          executionTasksFull={executionTasksFull}
          taskName={displayName}
        />
      </Tab>
    ),
  };

  const activeTabs = Object.keys(tabIsActive).filter(
    (tab) => tabIsActive[tab as TaskTab],
  ) as TaskTab[];

  return { tabMap, activeTabs };
};

const TaskTabs: React.FC<TaskTabProps> = ({ isDisplayTask, task }) => {
  const { [slugs.tab]: urlTab } = useParams<{ [slugs.tab]: TaskTab }>();
  const taskAnalytics = useTaskAnalytics();
  const { data: taskTestCountData } = useQuery<
    TaskTestCountQuery,
    TaskTestCountQueryVariables
  >(TASK_TEST_COUNT, {
    variables: {
      taskId: task.id,
      execution: task.execution,
    },
  });
  const { data: taskPerfPluginEnabledData } = useQuery<
    TaskPerfPluginEnabledQuery,
    TaskPerfPluginEnabledQueryVariables
  >(TASK_PERF_PLUGIN_ENABLED, {
    variables: {
      taskId: task.id,
      execution: task.execution,
    },
  });
  const { failedTestCount } = taskTestCountData?.task || {};

  const [params] = useQueryParams();
  const navigate = useNavigate();
  const { activeTabs, tabMap } = useTabConfig(
    task,
    taskTestCountData?.task,
    taskPerfPluginEnabledData?.task,
    isDisplayTask,
  );

  const tabIndex = useMemo(
    () =>
      getDefaultTab({
        activeTabs,
        failedTestCount: failedTestCount ?? 0,
        isDisplayTask,
        urlTab,
      }),
    [activeTabs, failedTestCount, isDisplayTask, urlTab],
  );

  // Update the default tab in the url if it isn't populated or if the tab is not the same as the current tab
  useEffect(() => {
    const isValidTab = urlTab && activeTabs.includes(urlTab);
    if (urlTab === undefined || !isValidTab) {
      navigate(
        getTaskRoute(task.id, {
          ...params,
          tab: activeTabs[tabIndex],
        } as GetTaskRouteOptions),
        { replace: true },
      );
      if (urlTab === undefined) {
        taskAnalytics.sendEvent({
          name: "Redirected to default tab",
          tab: activeTabs[tabIndex],
        });
      }
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTab, activeTabs, params, task.id, task.execution, tabIndex]);

  const setURLTab = useCallback(
    (newTabIndex: number) => {
      const newUrl = getTaskRoute(task.id, {
        ...params,
        execution: task.execution,
        tab: activeTabs[newTabIndex],
      } as GetTaskRouteOptions);
      navigate(newUrl, { replace: true });
    },
    [task.id, task.execution, params, activeTabs, navigate],
  );

  const handleTabChange = (newTab: React.SetStateAction<number>) => {
    const newTabIndex =
      typeof newTab === "function"
        ? newTab(activeTabs.indexOf(urlTab ?? activeTabs[tabIndex]))
        : newTab;
    taskAnalytics.sendEvent({
      name: "Changed tab",
      tab: activeTabs[newTabIndex],
    });
    setURLTab(newTabIndex);
  };
  useTabShortcut({
    currentTab: tabIndex,
    numTabs: activeTabs.length,
    setSelectedTab: handleTabChange,
  });

  return (
    <StyledTabs
      aria-label="Task Page Tabs"
      onValueChange={handleTabChange}
      value={tabIndex}
    >
      {activeTabs.map((tab) => tabMap[tab])}
    </StyledTabs>
  );
};

export default TaskTabs;
