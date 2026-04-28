import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const SectionsToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { logMetadata, preferences } = useLogContext();
  const { sectionsEnabled, setSectionsEnabled } = preferences;

  const isTaskLog = logMetadata?.logType === LogTypes.EVERGREEN_TASK_LOGS;

  return (
    <BaseToggle
      data-cy="sections-toggle"
      disabled={!isTaskLog}
      label="Sections"
      onChange={(value) => {
        setSectionsEnabled(value);
        sendEvent({ name: "Toggled sections", on: value });
      }}
      tooltip="Toggle sections. Only available for Evergreen task logs."
      value={sectionsEnabled}
    />
  );
};

export default SectionsToggle;
