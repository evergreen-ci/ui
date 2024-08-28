import { useRef } from "react";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useSectionsFeatureDiscoveryContext } from "context/SectionsFeatureDiscoveryContext";
import { ParsleySettingsInput } from "gql/generated/types";
import BaseToggle from "../BaseToggle";

interface SectionsToggleProps {
  checked: boolean;
  updateSettings: (parsleySettings: ParsleySettingsInput) => void;
}

const SectionsToggle: React.FC<SectionsToggleProps> = ({
  checked,
  updateSettings,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  const { logMetadata } = useLogContext();

  const isTaskLog = logMetadata?.logType === LogTypes.EVERGREEN_TASK_LOGS;
  const { closeFirstGuideCue, isOpenFirstGuideCue, setIsOpenFirstGuideCue } =
    useSectionsFeatureDiscoveryContext();
  const triggerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <GuideCue
        currentStep={1}
        data-cy="sections-cue-1"
        numberOfSteps={1}
        onPrimaryButtonClick={closeFirstGuideCue}
        open={isOpenFirstGuideCue}
        refEl={triggerRef}
        setOpen={setIsOpenFirstGuideCue}
        title="Opt-In to Sectioned Task Logs"
        tooltipAlign="bottom"
        tooltipJustify="end"
      >
        This beta feature is now available for task logs. Please send over any
        feedback to the #ask-devprod-evergreen channel.
      </GuideCue>
      <BaseToggle
        ref={triggerRef}
        data-cy="sections-toggle"
        disabled={!isTaskLog}
        label="Sections (Beta)"
        onChange={(value) => {
          updateSettings({
            sectionsEnabled: value,
          });
          sendEvent({ name: "Toggled sections", on: value });
        }}
        tooltip="Toggle sections. Only available for Evergreen task logs."
        value={checked}
      />
    </>
  );
};

export default SectionsToggle;
