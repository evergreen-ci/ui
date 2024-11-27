import { useState, useEffect, useMemo } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { CodeChanges } from "components/CodeChanges";
import { StyledTabs } from "components/styles/StyledTabs";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { Requester } from "constants/requesters";
import { getVersionRoute, slugs } from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import { usePrevious } from "hooks";
import { useTabShortcut } from "hooks/useTabShortcut";
import { DownstreamTasks } from "pages/version/DownstreamTasks";
import { Tasks } from "pages/version/Tasks";
import { PatchStatus, VersionPageTabs } from "types/patch";
import { queryString } from "utils";
import TaskDuration from "./TaskDuration";
import TestAnalysis from "./TestAnalysis";
import { TestAnalysisTabGuideCue } from "./TestAnalysis/TestAnalysisTabGuideCue";

const { parseQueryString } = queryString;

type ChildPatches = NonNullable<
  VersionQuery["version"]["patch"]
>["childPatches"];

interface VersionTabProps {
  version: VersionQuery["version"];
}

const getDownstreamTabName = (
  numFailedChildPatches: number,
  numStartedChildPatches: number,
  numSuccessChildPatches: number,
) => {
  if (numFailedChildPatches > 0) {
    return (
      <TabLabelWithBadge
        badgeText={numFailedChildPatches}
        badgeVariant="red"
        dataCyBadge="downstream-tab-badge"
        tabLabel="Downstream Projects"
      />
    );
  }
  if (numStartedChildPatches > 0) {
    return (
      <TabLabelWithBadge
        badgeText={numStartedChildPatches}
        badgeVariant="yellow"
        dataCyBadge="downstream-tab-badge"
        tabLabel="Downstream Projects"
      />
    );
  }
  if (numSuccessChildPatches > 0) {
    return (
      <TabLabelWithBadge
        badgeText={numSuccessChildPatches}
        badgeVariant="green"
        dataCyBadge="downstream-tab-badge"
        tabLabel="Downstream Projects"
      />
    );
  }
};

const tabMap = ({
  childPatches,
  numFailedChildPatches,
  numStartedChildPatches,
  numSuccessChildPatches,
  taskCount,
  versionId,
}: {
  taskCount: number;
  childPatches: ChildPatches;
  numFailedChildPatches: number;
  numStartedChildPatches: number;
  numSuccessChildPatches: number;
  versionId: string;
}): {
  [key in VersionPageTabs]: JSX.Element;
} => ({
  [VersionPageTabs.Tasks]: (
    <Tab key="tasks-tab" data-cy="task-tab" id="task-tab" name="Tasks">
      <Tasks taskCount={taskCount} />
    </Tab>
  ),
  [VersionPageTabs.TaskDuration]: (
    <Tab
      key="duration-tab"
      data-cy="duration-tab"
      id="duration-tab"
      name="Task Duration"
    >
      <TaskDuration taskCount={taskCount} />
    </Tab>
  ),
  [VersionPageTabs.Changes]: (
    <Tab
      key="changes-tab"
      data-cy="changes-tab"
      id="changes-tab"
      name="Changes"
    >
      <CodeChanges patchId={versionId} />
    </Tab>
  ),
  [VersionPageTabs.Downstream]: (
    <Tab
      key="downstream-tab"
      data-cy="downstream-tab"
      id="downstream-tab"
      name={getDownstreamTabName(
        numFailedChildPatches,
        numStartedChildPatches,
        numSuccessChildPatches,
      )}
    >
      <DownstreamTasks childPatches={childPatches} />
    </Tab>
  ),
  [VersionPageTabs.TestAnalysis]: (
    <Tab
      key="test-analysis-tab"
      data-cy="test-analysis-tab"
      id="test-analysis-tab"
      name={
        <>
          Test Analysis <TestAnalysisTabGuideCue />
        </>
      }
    >
      <TestAnalysis versionId={versionId} />
    </Tab>
  ),
});

export const VersionTabs: React.FC<VersionTabProps> = ({ version }) => {
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: VersionPageTabs;
  }>();
  const { search } = useLocation();
  const { sendEvent } = useVersionAnalytics(version.id);
  const navigate = useNavigate();

  const { isPatch, patch, requester, status, taskCount } = version || {};
  const { childPatches } = patch || {};

  const tabIsActive = useMemo(
    () => ({
      [VersionPageTabs.Tasks]: true,
      [VersionPageTabs.TaskDuration]: true,
      [VersionPageTabs.Changes]:
        isPatch && requester !== Requester.GitHubMergeQueue,
      [VersionPageTabs.Downstream]:
        childPatches !== undefined && childPatches !== null,
      [VersionPageTabs.TestAnalysis]: status !== PatchStatus.Success,
    }),
    [isPatch, requester, childPatches, status],
  );

  const allTabs = useMemo(() => {
    const numFailedChildPatches = childPatches
      ? childPatches.filter((c) => c.status === PatchStatus.Failed).length
      : 0;
    const numStartedChildPatches = childPatches
      ? childPatches.filter((c) => c.status === PatchStatus.Started).length
      : 0;
    const numSuccessChildPatches = childPatches
      ? childPatches.filter((c) => c.status === PatchStatus.Success).length
      : 0;
    return tabMap({
      taskCount: taskCount ?? 0,
      childPatches,
      numFailedChildPatches,
      numStartedChildPatches,
      numSuccessChildPatches,
      versionId: version.id,
    });
  }, [taskCount, childPatches, version.id]);

  const activeTabs = useMemo(
    () =>
      (Object.keys(allTabs) as VersionPageTabs[]).filter((t) => tabIsActive[t]),
    [allTabs, tabIsActive],
  );
  const isValidTab = tabIsActive[tab || VersionPageTabs.Tasks];
  const [selectedTab, setSelectedTab] = useState(
    activeTabs.indexOf(tab || VersionPageTabs.Tasks),
  );
  const previousTab = usePrevious(selectedTab);

  useEffect(() => {
    // If tab is not valid, set to task tab.
    if (!isValidTab) {
      navigate(getVersionRoute(version.id), { replace: true });
    }
    // If tab updates in URL without having clicked a tab (e.g. clicked build variant), update state here.
    else if (selectedTab !== activeTabs.indexOf(tab || VersionPageTabs.Tasks)) {
      setSelectedTab(activeTabs.indexOf(tab || VersionPageTabs.Tasks));
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the URL and selectedTab state based on new tab selected.
  const selectNewTab = (newTabIndex: number) => {
    const queryParams = parseQueryString(search);
    const newTab = activeTabs[newTabIndex];
    const newRoute = getVersionRoute(version.id, {
      tab: newTab as VersionPageTabs,
      ...queryParams,
    });
    navigate(newRoute, { replace: true });

    if (previousTab !== undefined && previousTab !== newTabIndex) {
      sendEvent({
        name: "Changed tab",
        tab: newTab as VersionPageTabs,
      });
    }
    setSelectedTab(newTabIndex);
  };
  useTabShortcut({
    currentTab: selectedTab,
    numTabs: activeTabs.length,
    setSelectedTab: selectNewTab,
  });
  return (
    <StyledTabs
      aria-label="Patch Tabs"
      selected={selectedTab}
      setSelected={selectNewTab}
    >
      {activeTabs.map((t: VersionPageTabs) => allTabs[t])}
    </StyledTabs>
  );
};
