import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  ScheduleTasks,
  RestartPatch,
  UnscheduleTasks,
  EnqueuePatch,
  AddNotification,
  DisableTasks,
  ScheduleUndispatchedBaseTasks,
} from "components/PatchActionButtons";
import SetPriority from "components/SetPriority";
import { PageButtonRow } from "components/styles";

interface ActionButtonProps {
  canEnqueueToCommitQueue: boolean;
  canReconfigure: boolean;
  isPatch: boolean;
  isPatchOnCommitQueue: boolean;
  patchDescription: string;
  versionId: string;
}

export const ActionButtons: React.FC<ActionButtonProps> = ({
  canEnqueueToCommitQueue,
  canReconfigure,
  isPatch,
  isPatchOnCommitQueue,
  patchDescription,
  versionId,
}) => {
  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      disabled={!canReconfigure}
      patchId={versionId}
    />,
    <UnscheduleTasks key="unschedule-tasks" versionId={versionId} />,
    <DisableTasks key="disable-tasks" versionId={versionId} />,
    <ScheduleUndispatchedBaseTasks
      key="schedule-undispatched-base-tasks"
      disabled={!isPatch}
      versionId={versionId}
    />,
    <SetPriority key="priority" versionId={versionId} />,
    <EnqueuePatch
      key="enqueue"
      commitMessage={patchDescription}
      disabled={!canEnqueueToCommitQueue}
      patchId={versionId}
    />,
  ];

  return (
    <PageButtonRow>
      <ScheduleTasks
        disabled={isPatchOnCommitQueue}
        isButton
        versionId={versionId}
      />
      <RestartPatch
        disabled={isPatchOnCommitQueue}
        isButton
        patchId={versionId}
        refetchQueries={["VersionTasks"]}
      />
      <AddNotification patchId={versionId} />
      <ButtonDropdown dropdownItems={dropdownItems} loading={false} />
    </PageButtonRow>
  );
};
