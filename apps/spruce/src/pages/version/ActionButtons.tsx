import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  ScheduleTasks,
  RestartPatch,
  UnscheduleTasks,
  AddNotification,
  DisableTasks,
  ScheduleUndispatchedBaseTasks,
  IncludeNeverActivatedTasksToggle,
  RefreshGitHubStatuses,
} from "components/PatchActionButtons";
import SetPriority from "components/SetPriority";
import { PageButtonRow } from "components/styles";
import { Requester } from "constants/requesters";

interface ActionButtonProps {
  activeTaskIds: string[];
  requester: string;
  isPatch: boolean;
  versionId: string;
}

export const ActionButtons: React.FC<ActionButtonProps> = ({
  activeTaskIds,
  isPatch,
  requester,
  versionId,
}) => {
  const priorityProps = activeTaskIds.length
    ? { taskIds: activeTaskIds }
    : { versionId };

  const isMergeQueuePatch = requester === Requester.GitHubMergeQueue;
  const isGitHubPR = requester === Requester.GitHubPR;
  const canRefreshGitHubStatuses = isGitHubPR || isMergeQueuePatch;

  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      disabled={!isPatch || isMergeQueuePatch}
      patchId={versionId}
    />,
    <UnscheduleTasks key="unschedule-tasks" versionId={versionId} />,
    <DisableTasks key="disable-tasks" versionId={versionId} />,
    <ScheduleUndispatchedBaseTasks
      key="schedule-undispatched-base-tasks"
      disabled={!isPatch}
      versionId={versionId}
    />,
    <SetPriority key="priority" {...priorityProps} />,
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
      <ScheduleTasks isButton versionId={versionId} />
      <RestartPatch
        disabled={isMergeQueuePatch}
        isButton
        isMergeQueuePatch={isMergeQueuePatch}
        patchId={versionId}
        refetchQueries={["VersionTasks"]}
      />
      <AddNotification patchId={versionId} />
      <ButtonDropdown dropdownItems={dropdownItems} loading={false} />
    </PageButtonRow>
  );
};
