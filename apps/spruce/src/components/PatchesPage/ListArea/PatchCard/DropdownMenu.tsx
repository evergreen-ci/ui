import { useState } from "react";
import { Align, Justify, Tooltip } from "@leafygreen-ui/tooltip";
import { useVersionAnalytics } from "analytics";
import {
  ButtonDropdown,
  DropdownItem,
  usePopconfirmAnchor,
} from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  SetPatchVisibility,
  UnscheduleTasksPopconfirm,
  useUnscheduleVersionTasks,
} from "components/PatchActionButtons";
import { ScheduleTasksModal } from "components/ScheduleTasksModal";
import { VersionRestartModal } from "components/VersionRestartModal";

interface Props {
  hasVersion: boolean;
  isMergeQueuePatch: boolean;
  isPatchHidden: boolean;
  patchId: string;
}
export const DropdownMenu: React.FC<Props> = ({
  hasVersion,
  isMergeQueuePatch,
  isPatchHidden,
  patchId,
}) => {
  const { sendEvent } = useVersionAnalytics(patchId);
  const { loading: unscheduling, unschedule } = useUnscheduleVersionTasks(
    patchId,
    refetchQueries,
  );
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [unschedulePopconfirmOpen, setUnschedulePopconfirmOpen] =
    useState(false);
  const { anchorRef, getItemProps } = usePopconfirmAnchor({
    isOpen: unschedulePopconfirmOpen,
    onClose: () => setUnschedulePopconfirmOpen(false),
  });

  const restartDisabled = !hasVersion || isMergeQueuePatch;
  const restartMessage = isMergeQueuePatch
    ? "GitHub merge queue patches cannot be restarted."
    : "This patch cannot be restarted.";

  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      disabled={isMergeQueuePatch}
      hasVersion={hasVersion}
      patchId={patchId}
    />,
    <DropdownItem
      key="schedule"
      data-testid="schedule-patch"
      isDisabled={!hasVersion}
      onAction={() => {
        sendEvent({ name: "Viewed schedule tasks modal" });
        setScheduleModalOpen(true);
      }}
    >
      Schedule
    </DropdownItem>,
    <DropdownItem
      key="unschedule"
      data-testid="unschedule-patch"
      isDisabled={!hasVersion || unscheduling}
      {...getItemProps(
        "unschedule",
        () => setUnschedulePopconfirmOpen(true),
        unschedulePopconfirmOpen,
      )}
    >
      Unschedule all tasks
    </DropdownItem>,
    <DropdownItem
      key="restart"
      data-testid="restart-version"
      isDisabled={restartDisabled}
      onAction={() => setRestartModalOpen(true)}
    >
      <Tooltip
        align={Align.Left}
        enabled={restartDisabled}
        justify={Justify.End}
        trigger={<span>Restart</span>}
      >
        {restartMessage}
      </Tooltip>
    </DropdownItem>,
    <SetPatchVisibility
      key="hide"
      isPatchHidden={isPatchHidden}
      patchId={patchId}
      refetchQueries={["UserPatches", "ProjectPatches"]}
    />,
  ];

  return (
    <>
      <ButtonDropdown
        data-testid="patch-card-dropdown"
        dropdownItems={dropdownItems}
        setOpen={(isOpen) => {
          if (!isOpen) {
            setUnschedulePopconfirmOpen(false);
          }
        }}
      />
      <ScheduleTasksModal
        open={scheduleModalOpen}
        setOpen={setScheduleModalOpen}
        versionId={patchId}
      />
      {unschedulePopconfirmOpen && (
        <UnscheduleTasksPopconfirm
          onConfirm={unschedule}
          open
          refEl={anchorRef}
          setOpen={setUnschedulePopconfirmOpen}
        />
      )}
      <VersionRestartModal
        onCancel={() => setRestartModalOpen(false)}
        onOk={() => setRestartModalOpen(false)}
        refetchQueries={refetchQueries}
        versionId={patchId}
        visible={restartModalOpen}
      />
    </>
  );
};

const refetchQueries = ["Version"];
