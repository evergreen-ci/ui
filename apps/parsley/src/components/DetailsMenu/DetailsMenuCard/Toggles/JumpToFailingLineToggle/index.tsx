import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const JumpToFailingLineToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { logMetadata, preferences } = useLogContext();
  const { jumpToFailingLineEnabled, setJumpToFailingLineEnabled } = preferences;
  const isTaskLog = logMetadata?.logType === LogTypes.EVERGREEN_TASK_LOGS;

  return (
    <BaseToggle
      data-cy="jump-to-failing-line-toggle"
      disabled={!isTaskLog}
      label="Jump to Failing Line"
      onChange={(value) => {
        setJumpToFailingLineEnabled(value);
        sendEvent({ name: "Toggled jump to failing line", on: value });
      }}
      tooltip="Automatically scroll to the failing log line on page load. Only available for task logs."
      value={jumpToFailingLineEnabled}
    />
  );
};

export default JumpToFailingLineToggle;
