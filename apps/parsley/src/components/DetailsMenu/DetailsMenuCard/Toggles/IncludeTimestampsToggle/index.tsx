import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const IncludeTimestampsToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { includeTimestamps, setIncludeTimestamps } = preferences;

  return (
    <BaseToggle
      data-cy="include-timestamps-toggle"
      label="Include Timestamps"
      onChange={(value) => {
        sendEvent({ name: "Toggled include timestamps", on: value });
        setIncludeTimestamps(value);
      }}
      tooltip="Whether timestamps are included at the beginning of log lines. Changing this setting will reload the page to re-download the log."
      value={includeTimestamps}
    />
  );
};

export default IncludeTimestampsToggle;
