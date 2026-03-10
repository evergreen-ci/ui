import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const IncludeTimestampsToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { logMetadata, preferences } = useLogContext();
  const { includeTimestamps, setIncludeTimestamps } = preferences;

  const isSupported = logMetadata?.logType === LogTypes.EVERGREEN_TEST_LOGS;

  return (
    <BaseToggle
      data-cy="include-timestamps-toggle"
      disabled={!isSupported}
      label="Include Timestamps"
      onChange={(value) => {
        sendEvent({ name: "Toggled include timestamps", on: value });
        setIncludeTimestamps(value);
      }}
      tooltip={
        isSupported
          ? "Whether timestamps are included at the beginning of log lines. Changing this setting will reload the page to re-download the log."
          : "This option is only available for Evergreen test logs."
      }
      value={includeTimestamps}
    />
  );
};

export default IncludeTimestampsToggle;
