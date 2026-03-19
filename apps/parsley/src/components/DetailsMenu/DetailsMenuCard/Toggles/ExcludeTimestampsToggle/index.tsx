import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const ExcludeTimestampsToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { logMetadata, preferences } = useLogContext();
  const { excludeTimestamps, setExcludeTimestamps } = preferences;

  const isSupported = logMetadata?.logType === LogTypes.EVERGREEN_TEST_LOGS;

  return (
    <BaseToggle
      data-cy="exclude-timestamps-toggle"
      disabled={!isSupported}
      label="Exclude Timestamps"
      onChange={(value) => {
        sendEvent({ name: "Toggled exclude timestamps", on: value });
        setExcludeTimestamps(value);
      }}
      tooltip={
        isSupported
          ? "Whether to exclude timestamps at the beginning of log lines. Changing this setting will reload the page to re-download the log."
          : "This option is only available for Evergreen test logs."
      }
      value={excludeTimestamps}
    />
  );
};

export default ExcludeTimestampsToggle;
