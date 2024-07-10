import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { ParsleySettingsInput } from "gql/generated/types";
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

  return (
    <BaseToggle
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
  );
};

export default JumpToFailingLineToggle;
