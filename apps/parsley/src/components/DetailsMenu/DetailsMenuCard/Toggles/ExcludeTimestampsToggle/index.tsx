import { usePreferencesAnalytics } from "analytics";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const ExcludeTimestampsToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { logMetadata, preferences } = useLogContext();
  const { excludeTimestamps, setExcludeTimestamps } = preferences;

  const isResmoke = logMetadata?.renderingType === LogRenderingTypes.Resmoke;

  const isSupported =
    !isResmoke &&
    (logMetadata?.logType === LogTypes.EVERGREEN_TEST_LOGS ||
      logMetadata?.logType === LogTypes.EVERGREEN_TASK_LOGS);

  let tooltipMessage =
    "This option is only available for Evergreen task and test logs.";
  if (isResmoke) {
    tooltipMessage = "This option is not available for resmoke logs.";
  } else if (isSupported) {
    tooltipMessage =
      "Whether to exclude timestamps at the beginning of log lines. Changing this setting will reload the page to re-download the log.";
  }

  return (
    <BaseToggle
      data-cy="exclude-timestamps-toggle"
      disabled={!isSupported}
      label="Exclude Timestamps"
      onChange={(value) => {
        sendEvent({ name: "Toggled exclude timestamps", on: value });
        setExcludeTimestamps(value);
      }}
      tooltip={tooltipMessage}
      value={excludeTimestamps}
    />
  );
};

export default ExcludeTimestampsToggle;
