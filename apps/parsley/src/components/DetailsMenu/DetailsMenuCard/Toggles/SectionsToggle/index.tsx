import { useRef } from "react";
import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { SectionsToggleGuideCue } from "context/SectionsFeatureDiscoveryContext/SectionsToggleGuideCue";
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
  const triggerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <SectionsToggleGuideCue refEl={triggerRef} />
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
