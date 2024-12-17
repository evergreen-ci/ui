import { useState, useMemo } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { CodeChanges } from "components/CodeChanges";
import { StyledTabs } from "components/styles/StyledTabs";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { Requester } from "constants/requesters";
import { getVersionRoute, slugs } from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import { useTabShortcut } from "hooks/useTabShortcut";
import { PatchStatus, VersionPageTabs } from "types/patch";
import { queryString } from "utils";
import DownstreamTasks from "./DownstreamTasks";
import TaskDuration from "./TaskDuration";
import Tasks from "./Tasks";
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
  return (
    <TabLabelWithBadge
      badgeText={0}
      badgeVariant="lightgray"
      dataCyBadge="downstream-tab-badge"
      tabLabel="Downstream Projects"
    />
  );
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
  const [selectedTab, setSelectedTab] = useState(tab || VersionPageTabs.Tasks);

  const handleTabChange = (newTab: VersionPageTabs) => {
    if (!tabIsActive[newTab]) {
      return;
    }
    const queryParams = parseQueryString(search);

    setSelectedTab(newTab);
    sendEvent({ name: "Changed tab", tab: newTab });
    navigate(getVersionRoute(version.id, { tab: newTab, ...queryParams }), {
      replace: true,
    });
  };

  useTabShortcut({
    currentTab: activeTabs.indexOf(selectedTab),
    numTabs: activeTabs.length,
    setSelectedTab: (tabIndex) =>
      activeTabs[tabIndex] && handleTabChange(activeTabs[tabIndex]),
  });

  return (
    <StyledTabs
      aria-label="Patch Tabs"
      selected={activeTabs.indexOf(selectedTab)}
      // @ts-expect-error
      setSelected={(tabIndex: number) =>
        activeTabs[tabIndex] && handleTabChange(activeTabs[tabIndex])
      }
    >
      {activeTabs.map((t: VersionPageTabs) => allTabs[t])}
    </StyledTabs>
  );
};
