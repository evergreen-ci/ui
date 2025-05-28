import { useEffect } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { TrendChartsPlugin } from "components/PerfPlugin";
import { StyledTabs } from "components/styles/StyledTabs";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { isMainlineRequester, Requester } from "constants/requesters";
import { getTaskRoute, GetTaskRouteOptions, slugs } from "constants/routes";
import { TaskQuery } from "gql/generated/types";
import { useQueryParam, useQueryParams } from "hooks/useQueryParam";
import { useTabShortcut } from "hooks/useTabShortcut";
import { RequiredQueryParams, TaskTab } from "types/task";
import { BuildBaron } from "./taskTabs/buildBaron";
import { useBuildBaronVariables } from "./taskTabs/buildBaronAndAnnotations";
import { ExecutionTasksTable } from "./taskTabs/ExecutionTasksTable";
import FileTable from "./taskTabs/FileTable";
import { Logs } from "./taskTabs/Logs";
import TaskHistory from "./taskTabs/TaskHistory";
import { TestsTable } from "./taskTabs/TestsTable";

interface TaskTabProps {
  isDisplayTask: boolean;
  task: NonNullable<TaskQuery["task"]>;
}

const useTabConfig = (
  task: NonNullable<TaskQuery["task"]>,
  hasRequiredQueryParams: boolean,
  isDisplayTask: boolean,
) => {
  const {
    annotation,
    canModifyAnnotation,
    displayStatus,
    execution,
    executionTasksFull,
    failedTestCount,
    files,
    id,
    isPerfPluginEnabled,
    logs: logLinks,
    requester,
    versionMetadata,
  } = task;
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
    [TaskTab.TrendCharts]: isPerfPluginEnabled,
    [TaskTab.History]: isMainlineRequester(requester as Requester),
  };

  const tabMap: Record<TaskTab, JSX.Element> = {
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
              badgeVariant="red"
              dataCyBadge="tests-tab-badge"
              tabLabel="Tests"
            />
          ) : (
            "Tests"
          )
        }
      >
        {hasRequiredQueryParams && <TestsTable task={task} />}
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
              badgeVariant="lightgray"
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
        name={
          <TabLabelWithBadge
            badgeText="Beta"
            badgeVariant="blue"
            tabLabel="Task History"
          />
        }
      >
        <TaskHistory task={task} />
      </Tab>
    ),
  };

  const activeTabs = Object.keys(tabIsActive).filter(
    (tab) => tabIsActive[tab as TaskTab],
  ) as TaskTab[];

  return { tabMap, activeTabs };
};

export const TaskTabs: React.FC<TaskTabProps> = ({ isDisplayTask, task }) => {
  const { [slugs.tab]: urlTab } = useParams<{ [slugs.tab]: TaskTab }>();
  const taskAnalytics = useTaskAnalytics();
  const [execution] = useQueryParam<number | null>(
    RequiredQueryParams.Execution,
    null,
  );
  const [params] = useQueryParams();
  const navigate = useNavigate();
  const { activeTabs, tabMap } = useTabConfig(
    task,
    execution !== null,
    isDisplayTask,
  );

  const getDefaultTab = (): number => {
    if (urlTab && activeTabs.includes(urlTab))
      return activeTabs.indexOf(urlTab);
    if (isDisplayTask) return activeTabs.indexOf(TaskTab.ExecutionTasks);
    if (task.failedTestCount > 0) return activeTabs.indexOf(TaskTab.Tests);
    if (task.failedTestCount === 0 || !isDisplayTask)
      return activeTabs.indexOf(TaskTab.Logs);
    if (task.totalTestCount > 0) return activeTabs.indexOf(TaskTab.Tests);
    return 0;
  };

  // Update the default tab in the url if it isn't populated
  useEffect(() => {
    if (urlTab === undefined) {
      navigate(
        getTaskRoute(task.id, {
          ...params,
          tab: activeTabs[getDefaultTab()],
        } as GetTaskRouteOptions),
        { replace: true },
      );
      if (urlTab === undefined) {
        taskAnalytics.sendEvent({
          name: "Redirected to default tab",
          tab: activeTabs[getDefaultTab()],
        });
      }
      return;
    }
  }, [urlTab, activeTabs, params, task.id]);

  const setURLTab = (tabIndex: number) => {
    const newUrl = getTaskRoute(task.id, {
      ...params,
      execution,
      tab: activeTabs[tabIndex],
    } as GetTaskRouteOptions);
    navigate(newUrl, { replace: true });
  };
  useTabShortcut({
    currentTab: urlTab ? activeTabs.indexOf(urlTab) : getDefaultTab(),
    numTabs: activeTabs.length,
    setSelectedTab: setURLTab,
  });

  const handleTabChange = (newTab: React.SetStateAction<number>) => {
    const tabIndex =
      typeof newTab === "function"
        ? newTab(activeTabs.indexOf(urlTab ?? activeTabs[getDefaultTab()]))
        : newTab;
    taskAnalytics.sendEvent({
      name: "Changed tab",
      tab: activeTabs[tabIndex],
    });
    setURLTab(tabIndex);
  };
  return (
    <StyledTabs
      aria-label="Task Page Tabs"
      selected={activeTabs.indexOf(urlTab ?? activeTabs[getDefaultTab()])}
      setSelected={handleTabChange}
    >
      {activeTabs.map((tab) => tabMap[tab])}
    </StyledTabs>
  );
};
