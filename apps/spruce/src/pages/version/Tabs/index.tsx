import { useEffect, useMemo, useState } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { Unpacked } from "@evg-ui/lib/types/utils";
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

type ChildVersion = Unpacked<
  NonNullable<NonNullable<VersionQuery["version"]["childVersions"]>>
>;
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
        dataTestIdBadge="downstream-tab-badge"
        tabLabel="Downstream Projects"
      />
    );
  }
  if (numStartedChildPatches > 0) {
    return (
      <TabLabelWithBadge
        badgeText={numStartedChildPatches}
        badgeVariant="yellow"
        dataTestIdBadge="downstream-tab-badge"
        tabLabel="Downstream Projects"
      />
    );
  }
  if (numSuccessChildPatches > 0) {
    return (
      <TabLabelWithBadge
        badgeText={numSuccessChildPatches}
        badgeVariant="green"
        dataTestIdBadge="downstream-tab-badge"
        tabLabel="Downstream Projects"
      />
    );
  }
  return (
    <TabLabelWithBadge
      badgeText={0}
      badgeVariant="lightgray"
      dataTestIdBadge="downstream-tab-badge"
      tabLabel="Downstream Projects"
    />
  );
};

const tabMap = ({
  childVersions,
  isMergeQueuePatch,
  isVariantTimingView,
  numFailedChildPatches,
  numStartedChildPatches,
  numSuccessChildPatches,
  setActiveTaskIds,
  taskCount,
  versionId,
}: {
  childVersions: ChildVersion[];
  taskCount: number;
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
    <Tab key="tasks-tab" data-testid="task-tab" id="task-tab" name="Tasks">
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
      data-testid="duration-tab"
      id="duration-tab"
      name="Task Duration"
    >
      <TaskDuration taskCount={taskCount} versionId={versionId} />
    </Tab>
  ),
  [VersionPageTabs.Changes]: (
    <Tab
      key="changes-tab"
      data-testid="changes-tab"
      id="changes-tab"
      name="Changes"
    >
      <CodeChanges disableDiffLinks={isMergeQueuePatch} patchId={versionId} />
    </Tab>
  ),
  [VersionPageTabs.Downstream]: (
    <Tab
      key="downstream-tab"
      data-testid="downstream-tab"
      id="downstream-tab"
      name={getDownstreamTabName(
        numFailedChildPatches,
        numStartedChildPatches,
        numSuccessChildPatches,
      )}
    >
      <DownstreamTasks childVersions={childVersions ?? []} />
    </Tab>
  ),
  [VersionPageTabs.TestAnalysis]: (
    <Tab
      key="test-analysis-tab"
      data-testid="test-analysis-tab"
      id="test-analysis-tab"
      name="Test Analysis"
    >
      <TestAnalysis versionId={versionId} />
    </Tab>
  ),
  [VersionPageTabs.VersionTiming]: (
    <Tab
      key="version-timing-tab"
      data-testid="version-timing-tab"
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

  const { childVersions, isPatch, requester, status, taskCount } =
    version || {};
  const isMergeQueuePatch = requester === Requester.GitHubMergeQueue;

  const tabIsActive = useMemo(
    () => ({
      [VersionPageTabs.Tasks]: true,
      [VersionPageTabs.TaskDuration]: true,
      [VersionPageTabs.VersionTiming]: true,
      [VersionPageTabs.Changes]: isPatch,
      [VersionPageTabs.Downstream]:
        childVersions !== undefined && childVersions !== null,
      [VersionPageTabs.TestAnalysis]: status !== PatchStatus.Success,
    }),
    [isPatch, childVersions, status],
  );

  const allTabs = useMemo(() => {
    const numFailedChildPatches = childVersions
      ? childVersions.filter((c) => c.status === PatchStatus.Failed).length
      : 0;
    const numStartedChildPatches = childVersions
      ? childVersions.filter((c) => c.status === PatchStatus.Started).length
      : 0;
    const numSuccessChildPatches = childVersions
      ? childVersions.filter((c) => c.status === PatchStatus.Success).length
      : 0;
    return tabMap({
      taskCount: taskCount ?? 0,
      childVersions: childVersions ?? [],
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
    childVersions,
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
