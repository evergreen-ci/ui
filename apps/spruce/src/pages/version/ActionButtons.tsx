import { useState } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  usePopconfirmAnchor,
} from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  AddNotification,
  DisableTasksPopconfirm,
  IncludeNeverActivatedTasksToggle,
  RefreshGitHubStatuses,
  RestartPatch,
  ScheduleTasks,
  ScheduleUndispatchedBaseTasksPopconfirm,
  UnscheduleTasksPopconfirm,
} from "components/PatchActionButtons";
import SetPriority from "components/SetPriority";
import { PageButtonRow } from "components/styles";
import { Requester } from "constants/requesters";

type VersionPopconfirm =
  | "disable"
  | "priority"
  | "scheduleBaseTasks"
  | "unschedule";

interface ActionButtonProps {
  activeTaskIds: string[];
  isPatch: boolean;
  requester: string;
  versionId: string;
}

export const ActionButtons: React.FC<ActionButtonProps> = ({
  activeTaskIds,
  isPatch,
  requester,
  versionId,
}) => {
  const { anchorRef, getItemProps } = usePopconfirmAnchor();
  const [popconfirm, setPopconfirm] = useState<VersionPopconfirm | null>(null);
  const setOpenFor = (name: VersionPopconfirm) => (open: boolean) =>
    setPopconfirm(open ? name : null);
  const priorityProps = activeTaskIds.length
    ? { taskIds: activeTaskIds }
    : { versionId };
  const priorityLabel = activeTaskIds.length ? "task" : "patch";

  const isMergeQueuePatch = requester === Requester.GitHubMergeQueue;
  const isGitHubPR = requester === Requester.GitHubPR;
  const canRefreshGitHubStatuses = isMergeQueuePatch || isGitHubPR;

  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      disabled={!isPatch || isMergeQueuePatch}
      patchId={versionId}
    />,
    <DropdownItem
      key="unschedule-tasks"
      data-testid="unschedule-patch"
      {...getItemProps(
        "unschedule",
        () => setPopconfirm("unschedule"),
        popconfirm === "unschedule",
      )}
    >
      Unschedule all tasks
    </DropdownItem>,
    <DropdownItem
      key="disable-tasks"
      data-testid="disable"
      {...getItemProps(
        "disable",
        () => setPopconfirm("disable"),
        popconfirm === "disable",
      )}
    >
      Disable all tasks
    </DropdownItem>,
    <DropdownItem
      key="schedule-undispatched-base-tasks"
      isDisabled={!isPatch}
      {...getItemProps(
        "scheduleBaseTasks",
        () => setPopconfirm("scheduleBaseTasks"),
        popconfirm === "scheduleBaseTasks",
      )}
    >
      Schedule failing base tasks
    </DropdownItem>,
    <DropdownItem
      key="priority"
      data-testid="set-priority-menu-item"
      {...getItemProps(
        "priority",
        () => setPopconfirm("priority"),
        popconfirm === "priority",
      )}
    >
      Set {priorityLabel} priority
      {activeTaskIds.length > 1 && ` (${activeTaskIds.length})`}
    </DropdownItem>,
    <IncludeNeverActivatedTasksToggle
      key="include-never-activated-tasks"
      versionId={versionId}
    />,
  ];

  return (
    <PageButtonRow>
      {canRefreshGitHubStatuses && (
        <RefreshGitHubStatuses versionId={versionId} />
      )}
      <ScheduleTasks versionId={versionId} />
      <RestartPatch
        disabled={isMergeQueuePatch}
        isMergeQueuePatch={isMergeQueuePatch}
        patchId={versionId}
        refetchQueries={["VersionTasks"]}
      />
      <AddNotification patchId={versionId} />
      <ButtonDropdown dropdownItems={dropdownItems} loading={false} />
      {popconfirm === "unschedule" && (
        <UnscheduleTasksPopconfirm
          open
          refEl={anchorRef}
          setOpen={setOpenFor("unschedule")}
          versionId={versionId}
        />
      )}
      {popconfirm === "disable" && (
        <DisableTasksPopconfirm
          open
          refEl={anchorRef}
          setOpen={setOpenFor("disable")}
          versionId={versionId}
        />
      )}
      {popconfirm === "scheduleBaseTasks" && (
        <ScheduleUndispatchedBaseTasksPopconfirm
          open
          refEl={anchorRef}
          setOpen={setOpenFor("scheduleBaseTasks")}
          versionId={versionId}
        />
      )}
      {popconfirm === "priority" && (
        <SetPriority
          {...priorityProps}
          onOpenChange={setOpenFor("priority")}
          open
          refEl={anchorRef}
        />
      )}
    </PageButtonRow>
  );
};
