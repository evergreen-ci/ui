import { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  UnscheduleTasks,
  RestartPatch,
  EnqueuePatch,
  ScheduleTasks,
  SetPatchVisibility,
} from "components/PatchActionButtons";

interface Props {
  canEnqueueToCommitQueue: boolean;
  hasVersion: boolean;
  isPatchHidden: boolean;
  isPatchOnCommitQueue: boolean;
  patchDescription: string;
  patchId: string;
}
export const DropdownMenu: React.FC<Props> = ({
  canEnqueueToCommitQueue,
  hasVersion,
  isPatchHidden,
  isPatchOnCommitQueue,
  patchDescription,
  patchId,
}) => {
  const restartModalVisibilityControl = useState(false);
  const enqueueModalVisibilityControl = useState(false);
  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      disabled={isPatchOnCommitQueue}
      hasVersion={hasVersion}
      patchId={patchId}
    />,
    <ScheduleTasks key="schedule" disabled={!hasVersion} versionId={patchId} />,
    <UnscheduleTasks
      key="unschedule"
      disabled={!hasVersion}
      refetchQueries={refetchQueries}
      versionId={patchId}
    />,
    <RestartPatch
      key="restart"
      disabled={!hasVersion}
      patchId={patchId}
      refetchQueries={refetchQueries}
      visibilityControl={restartModalVisibilityControl}
    />,
    <EnqueuePatch
      key="enqueue"
      commitMessage={patchDescription}
      disabled={!canEnqueueToCommitQueue || !hasVersion}
      patchId={patchId}
      refetchQueries={refetchQueries}
      visibilityControl={enqueueModalVisibilityControl}
    />,
    <SetPatchVisibility
      key="hide"
      isPatchHidden={isPatchHidden}
      patchId={patchId}
      refetchQueries={["UserPatches", "ProjectPatches"]}
    />,
  ];

  return (
    <ButtonDropdown
      data-cy="patch-card-dropdown"
      dropdownItems={dropdownItems}
    />
  );
};

const refetchQueries = ["Version"];
