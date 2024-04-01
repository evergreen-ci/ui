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
  const { logType } = logMetadata || {};
  const isTaskLog = logType === LogTypes.EVERGREEN_TASK_LOGS;

  return (
    <BaseToggle
      data-cy="jump-to-failing-line-toggle"
      disabled={!isTaskLog}
      label="Jump to Failing Line"
      onChange={(value) => {
        updateSettings({ jumpToFailingLineEnabled: value });
        sendEvent({ name: "Toggled Jump to Failing Line", on: value });
      }}
      tooltip="Toggle scroll to failing line on page load. Only available for task logs."
      value={checked}
    />
  );
};

export default JumpToFailingLineToggle;
