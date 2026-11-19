import { useRef, useState } from "react";
import { ButtonDropdown, DropdownItem } from "components/ButtonDropdown";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
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
      onAction={() => setPopconfirm("unschedule")}
    >
      Unschedule all tasks
    </DropdownItem>,
    <DropdownItem
      key="disable-tasks"
      data-testid="disable"
      onAction={() => setPopconfirm("disable")}
    >
      Disable all tasks
    </DropdownItem>,
    <DropdownItem
      key="schedule-undispatched-base-tasks"
      isDisabled={!isPatch}
      onAction={() => setPopconfirm("scheduleBaseTasks")}
    >
      Schedule failing base tasks
    </DropdownItem>,
    <DropdownItem
      key="priority"
      data-testid="set-priority-menu-item"
      onAction={() => setPopconfirm("priority")}
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
      <ButtonDropdown
        dropdownItems={dropdownItems}
        loading={false}
        triggerRef={triggerRef}
      />
      <UnscheduleTasksPopconfirm
        open={popconfirm === "unschedule"}
        refEl={triggerRef}
        setOpen={setOpenFor("unschedule")}
        versionId={versionId}
      />
      <DisableTasksPopconfirm
        open={popconfirm === "disable"}
        refEl={triggerRef}
        setOpen={setOpenFor("disable")}
        versionId={versionId}
      />
      <ScheduleUndispatchedBaseTasksPopconfirm
        open={popconfirm === "scheduleBaseTasks"}
        refEl={triggerRef}
        setOpen={setOpenFor("scheduleBaseTasks")}
        versionId={versionId}
      />
      <SetPriority
        {...priorityProps}
        onOpenChange={setOpenFor("priority")}
        open={popconfirm === "priority"}
        refEl={triggerRef}
      />
    </PageButtonRow>
  );
};
