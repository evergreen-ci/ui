import { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  UnscheduleTasks,
  RestartPatch,
  ScheduleTasks,
  SetPatchVisibility,
} from "components/PatchActionButtons";

interface Props {
  hasVersion: boolean;
  isPatchHidden: boolean;
  patchId: string;
}
export const DropdownMenu: React.FC<Props> = ({
  hasVersion,
  isPatchHidden,
  patchId,
}) => {
  const restartModalVisibilityControl = useState(false);
  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
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
