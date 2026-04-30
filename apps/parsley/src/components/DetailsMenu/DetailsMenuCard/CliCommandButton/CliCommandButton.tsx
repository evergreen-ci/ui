import styled from "@emotion/styled";
import { Copyable } from "@leafygreen-ui/copyable";
import { Origin } from "@evg-ui/lib/constants/logURLTemplates";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { LogMetadata } from "context/LogContext/types";

const CliCommandButton: React.FC = () => {
  const { logMetadata } = useLogContext();

  const command = getCliCommand(logMetadata);
  if (!command) {
    return null;
  }

  return (
    <StyledCopyable
      data-cy="cli-command-copyable"
      label="Fetch the log via Evergreen CLI"
    >
      {command}
    </StyledCopyable>
  );
};

const originToCLIType: Record<Origin, string> = {
  [Origin.Agent]: "agent_log",
  [Origin.All]: "all_logs",
  [Origin.System]: "system_log",
  [Origin.Task]: "task_log",
};

// Based on documentation at https://docs.devprod.prod.corp.mongodb.com/parsley/Downloading-Logs.
const getCliCommand = (logMetadata?: LogMetadata): string | null => {
  if (!logMetadata) {
    return null;
  }
  const { execution, logPath, logType, logsToMerge, taskID } = logMetadata;
  if (!logType || !taskID || execution == null) {
    return null;
  }
  if (logType === LogTypes.EVERGREEN_TASK_LOGS) {
    const origin = (logMetadata?.origin?.toLowerCase() ||
      Origin.Task) as Origin;
    const taskType = originToCLIType[origin];
    return `evergreen task build TaskLogs --task_id ${taskID} --execution ${execution} --type ${taskType} --o output.txt`;
  }
  if (logType === LogTypes.EVERGREEN_TEST_LOGS) {
    if (!logPath) {
      return null;
    }
    const logsToMergeFlags =
      logsToMerge?.map((l) => `--logs_to_merge ${l}`).join(" ") ?? "";
    return `evergreen task build TestLogs --task_id ${taskID} --execution ${execution} --log_path ${logPath} ${logsToMergeFlags} --o output.txt`;
  }
  // Unsupported log type.
  return null;
};

const StyledCopyable = styled(Copyable)`
  width: 100%;
`;

export default CliCommandButton;
