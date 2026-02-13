import { useState, useMemo, useEffect } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useVersionAnalytics } from "analytics";
import { CodeChanges } from "components/CodeChanges";
import { StyledTabs } from "components/styles/StyledTabs";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { Requester } from "constants/requesters";
import { getVersionRoute, slugs } from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import { useTabShortcut } from "hooks/useTabShortcut";
import { PatchStatus, VersionPageTabs } from "types/patch";
import DownstreamTasks from "./DownstreamTasks";
import TaskDuration from "./TaskDuration";
import Tasks from "./Tasks";
import TestAnalysis from "./TestAnalysis";
import { VersionTiming } from "./VersionTiming";

type ChildPatches = NonNullable<
  VersionQuery["version"]["patch"]
>["childPatches"];

interface VersionTabProps {
  setActiveTaskIds: React.Dispatch<React.SetStateAction<string[]>>;
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
  isMergeQueuePatch,
  isVariantTimingView,
  numFailedChildPatches,
  numStartedChildPatches,
  numSuccessChildPatches,
  setActiveTaskIds,
  taskCount,
  versionId,
}: {
  taskCount: number;
  childPatches: ChildPatches;
  isMergeQueuePatch: boolean;
  numFailedChildPatches: number;
  numStartedChildPatches: number;
  numSuccessChildPatches: number;
  setActiveTaskIds: React.Dispatch<React.SetStateAction<string[]>>;
  versionId: string;
  isVariantTimingView: boolean;
}): {
  [key in VersionPageTabs]: React.JSX.Element;
} => ({
  [VersionPageTabs.Tasks]: (
    <Tab key="tasks-tab" data-cy="task-tab" id="task-tab" name="Tasks">
      <Tasks
        setActiveTaskIds={setActiveTaskIds}
        taskCount={taskCount}
        versionId={versionId}
      />
    </Tab>
  ),
  [VersionPageTabs.TaskDuration]: (
    <Tab
      key="duration-tab"
      data-cy="duration-tab"
      id="duration-tab"
      name="Task Duration"
    >
      <TaskDuration taskCount={taskCount} versionId={versionId} />
    </Tab>
  ),
  [VersionPageTabs.Changes]: (
    <Tab
      key="changes-tab"
      data-cy="changes-tab"
      id="changes-tab"
      name="Changes"
    >
      <CodeChanges disableDiffLinks={isMergeQueuePatch} patchId={versionId} />
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
      name="Test Analysis"
    >
      <TestAnalysis versionId={versionId} />
    </Tab>
  ),
  [VersionPageTabs.VersionTiming]: (
    <Tab
      key="version-timing-tab"
      data-cy="version-timing-tab"
      id="version-timing-tab"
      name={isVariantTimingView ? "Variant Timing" : "Version Timing"}
    >
      <VersionTiming taskCount={taskCount} versionId={versionId} />
    </Tab>
  ),
});

const VersionTabs: React.FC<VersionTabProps> = ({
  setActiveTaskIds,
  version,
}) => {
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: VersionPageTabs;
  }>();
  const { sendEvent } = useVersionAnalytics(version.id);
  const navigate = useNavigate();
  const [queryParams] = useQueryParams();

  const { isPatch, patch, requester, status, taskCount } = version || {};
  const { childPatches } = patch || {};
  const isMergeQueuePatch = requester === Requester.GitHubMergeQueue;

  const tabIsActive = useMemo(
    () => ({
      [VersionPageTabs.Tasks]: true,
      [VersionPageTabs.TaskDuration]: true,
      [VersionPageTabs.VersionTiming]: true,
      [VersionPageTabs.Changes]: isPatch,
      [VersionPageTabs.Downstream]:
        childPatches !== undefined && childPatches !== null,
      [VersionPageTabs.TestAnalysis]: status !== PatchStatus.Success,
    }),
    [isPatch, childPatches, status],
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
      isMergeQueuePatch,
      numFailedChildPatches,
      numStartedChildPatches,
      numSuccessChildPatches,
      setActiveTaskIds,
      versionId: version.id,
      isVariantTimingView: !!queryParams.variant,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    taskCount,
    childPatches,
    isMergeQueuePatch,
    version.id,
    queryParams.variant,
  ]);

  const activeTabs = useMemo(
    () =>
      (Object.keys(allTabs) as VersionPageTabs[]).filter((t) => tabIsActive[t]),
    [allTabs, tabIsActive],
  );
  const [selectedTab, setSelectedTab] = useState(tab);

  const handleTabChange = (newTab: VersionPageTabs, sendAnalytics: boolean) => {
    if (!tabIsActive[newTab]) {
      return;
    }

    setSelectedTab(newTab);
    // In cases where we're changing tabs due to a non user action (e.g. a redirect we want to avoid sending analytics)
    if (sendAnalytics) {
      sendEvent({ name: "Changed tab", tab: newTab });
    }
    navigate(getVersionRoute(version.id, { tab: newTab, ...queryParams }), {
      replace: true,
    });
  };

  // Handle redirecting to the correct tab if the tab is not active
  useEffect(() => {
    if (!tab || !tabIsActive[tab]) {
      handleTabChange(VersionPageTabs.Tasks, false);
    } else {
      setSelectedTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, tabIsActive]);

  useTabShortcut({
    currentTab: selectedTab ? activeTabs.indexOf(selectedTab) : 0,
    numTabs: activeTabs.length,
    setSelectedTab: (tabIndex) =>
      activeTabs[tabIndex] && handleTabChange(activeTabs[tabIndex], true),
  });

  return selectedTab ? (
    <StyledTabs
      aria-label="Version Tabs"
      onValueChange={(tabIndex: number) =>
        activeTabs[tabIndex] && handleTabChange(activeTabs[tabIndex], true)
      }
      value={activeTabs.indexOf(selectedTab)}
    >
      {activeTabs.map((t: VersionPageTabs) => allTabs[t])}
    </StyledTabs>
  ) : null;
};

export default VersionTabs;
