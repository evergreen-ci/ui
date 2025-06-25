import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  ScheduleTasks,
  RestartPatch,
  UnscheduleTasks,
  AddNotification,
  DisableTasks,
  ScheduleUndispatchedBaseTasks,
} from "components/PatchActionButtons";
import SetPriority from "components/SetPriority";
import { PageButtonRow } from "components/styles";

interface ActionButtonProps {
  activeTaskIds: string[];
  isMergeQueuePatch: boolean;
  isPatch: boolean;
  versionId: string;
}

export const ActionButtons: React.FC<ActionButtonProps> = ({
  activeTaskIds,
  isMergeQueuePatch,
  isPatch,
  versionId,
}) => {
  const priorityProps = activeTaskIds.length
    ? { taskIds: activeTaskIds }
    : { versionId };
  console.log(activeTaskIds);

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
  ];

  return (
    <PageButtonRow>
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
