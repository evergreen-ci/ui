import { useRef } from "react";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useSectionsFeatureDiscoveryContext } from "context/SectionsFeatureDiscoveryContext";
import { ParsleySettingsInput } from "gql/generated/types";
import { releaseSectioning } from "utils/featureFlag";
import BaseToggle from "../BaseToggle";

interface JumpToFailingLineToggleProps {
  checked: boolean;
  updateSettings: (parsleySettings: ParsleySettingsInput) => void;
}

const JumpToFailingLineToggle: React.FC<JumpToFailingLineToggleProps> = ({
  checked,
  updateSettings,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  const { logMetadata } = useLogContext();
  const isTaskLog = logMetadata?.logType === LogTypes.EVERGREEN_TASK_LOGS;
  const { closeSecondGuideCue, isOpenSecondGuideCue, setIsOpenSecondGuideCue } =
    useSectionsFeatureDiscoveryContext();
  const triggerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      {releaseSectioning && (
        <GuideCue
          beaconAlign="right"
          data-cy="sections-cue-2"
          numberOfSteps={1}
          onPrimaryButtonClick={closeSecondGuideCue}
          open={isOpenSecondGuideCue}
          refEl={triggerRef}
          setOpen={setIsOpenSecondGuideCue}
          title="Jump to Failing Line"
        >
          Combined with sectioning, jump to failing line allows to streamline
          your failure triage process.
        </GuideCue>
      )}
      <BaseToggle
        ref={triggerRef}
        data-cy="jump-to-failing-line-toggle"
        disabled={!isTaskLog}
        label="Jump to Failing Line"
        onChange={(value) => {
          updateSettings({ jumpToFailingLineEnabled: value });
          sendEvent({ name: "Toggled jump to failing line", on: value });
        }}
        tooltip="Automatically scroll to the failing log line on page load. Only available for task logs."
        value={checked}
      />
    </>
  );
};

export default JumpToFailingLineToggle;
