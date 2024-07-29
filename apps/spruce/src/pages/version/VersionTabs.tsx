import { useState, useEffect, useMemo } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { CodeChanges } from "components/CodeChanges";
import { StyledTabs } from "components/styles/StyledTabs";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { getVersionRoute, slugs } from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import { usePrevious } from "hooks";
import { useTabShortcut } from "hooks/useTabShortcut";
import { DownstreamTasks } from "pages/version/DownstreamTasks";
import { Tasks } from "pages/version/Tasks";
import { PatchStatus, PatchTab } from "types/patch";
import { queryString } from "utils";
import TaskDuration from "./TaskDuration";

const { parseQueryString } = queryString;

interface Props {
  taskCount: number;
  isPatch: boolean;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  childPatches: VersionQuery["version"]["patch"]["childPatches"];
}

const tabMap = ({
  childPatches,
  numFailedChildPatches,
  taskCount,
  versionId,
}: {
  taskCount: number;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  childPatches: VersionQuery["version"]["patch"]["childPatches"];
  numFailedChildPatches: number;
  versionId: string;
}) => ({
  [PatchTab.Tasks]: (
    <Tab name="Tasks" id="task-tab" data-cy="task-tab" key="tasks-tab">
      <Tasks taskCount={taskCount} />
    </Tab>
  ),
  [PatchTab.TaskDuration]: (
    <Tab
      name="Task Duration"
      id="duration-tab"
      data-cy="duration-tab"
      key="duration-tab"
    >
      <TaskDuration taskCount={taskCount} />
    </Tab>
  ),
  [PatchTab.Changes]: (
    <Tab
      name="Changes"
      id="changes-tab"
      data-cy="changes-tab"
      key="changes-tab"
    >
      <CodeChanges patchId={versionId} />
    </Tab>
  ),
  [PatchTab.Downstream]: (
    <Tab
      name={
        numFailedChildPatches ? (
          <TabLabelWithBadge
            badgeText={numFailedChildPatches}
            badgeVariant="red"
            dataCyBadge="downstream-tab-badge"
            tabLabel="Downstream Projects"
          />
        ) : (
          "Downstream Projects"
        )
      }
      id="downstream-tab"
      data-cy="downstream-tab"
      key="downstream-tab"
    >
      <DownstreamTasks childPatches={childPatches} />
    </Tab>
  ),
});
export const VersionTabs: React.FC<Props> = ({
  childPatches,
  isPatch,
  taskCount,
}) => {
  const { [slugs.versionId]: versionId, [slugs.tab]: tab } = useParams<{
    [slugs.versionId]: string;
    [slugs.tab]: PatchTab;
  }>();
  const { search } = useLocation();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { sendEvent } = useVersionAnalytics(versionId);
  const navigate = useNavigate();

  const tabIsActive = useMemo(
    () => ({
      [PatchTab.Tasks]: true,
      [PatchTab.TaskDuration]: true,
      [PatchTab.Changes]: isPatch,
      [PatchTab.Downstream]: childPatches,
    }),
    [isPatch, childPatches],
  );

  const allTabs = useMemo(() => {
    const numFailedChildPatches = childPatches
      ? // @ts-expect-error: FIXME. This comment was added by an automated script.
        childPatches.filter((c) => c.status === PatchStatus.Failed).length
      : 0;
    return tabMap({
      taskCount,
      childPatches,
      numFailedChildPatches,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      versionId,
    });
  }, [taskCount, childPatches, versionId]);

  const activeTabs = useMemo(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    () => Object.keys(allTabs).filter((t) => tabIsActive[t] as PatchTab[]),
    [allTabs, tabIsActive],
  );
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const isValidTab = tabIsActive[tab];
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const [selectedTab, setSelectedTab] = useState(activeTabs.indexOf(tab));
  const previousTab = usePrevious(selectedTab);

  useEffect(() => {
    // If tab is not valid, set to task tab.
    if (!isValidTab) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      navigate(getVersionRoute(versionId), { replace: true });
    }
    // If tab updates in URL without having clicked a tab (e.g. clicked build variant), update state here.
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    else if (selectedTab !== activeTabs.indexOf(tab)) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      setSelectedTab(activeTabs.indexOf(tab));
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the URL and selectedTab state based on new tab selected.
  const selectNewTab = (newTabIndex: number) => {
    const queryParams = parseQueryString(search);
    const newTab = activeTabs[newTabIndex];
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const newRoute = getVersionRoute(versionId, {
      tab: newTab as PatchTab,
      ...queryParams,
    });
    navigate(newRoute, { replace: true });

    if (previousTab !== undefined && previousTab !== newTabIndex) {
      sendEvent({
        name: "Changed tab",
        tab: newTab as PatchTab,
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
      selected={selectedTab}
      setSelected={selectNewTab}
      aria-label="Patch Tabs"
    >
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      {activeTabs.map((t: string) => allTabs[t])}
    </StyledTabs>
  );
};
