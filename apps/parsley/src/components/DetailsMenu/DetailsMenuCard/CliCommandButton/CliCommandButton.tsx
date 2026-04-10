import styled from "@emotion/styled";
import { Copyable } from "@leafygreen-ui/copyable";
import { size } from "@evg-ui/lib/constants/tokens";
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
    <Container>
      <StyledCopyable
        data-cy="cli-command-copyable"
        label="Fetch the log via Evergreen CLI"
      >
        {command}
      </StyledCopyable>
    </Container>
  );
};

const getCliCommand = (logMetadata?: LogMetadata): string | null => {
  if (!logMetadata) {
    return null;
  }
  const { execution, logPath, logType, taskID } = logMetadata;
  if (!logType || !taskID || execution == null) {
    return null;
  }

  // Based on documentation at
  // https://docs.devprod.prod.corp.mongodb.com/parsley/Downloading-Logs.
  if (logType === LogTypes.EVERGREEN_TASK_LOGS) {
    const origin = logMetadata?.origin?.toLowerCase() || "task";
    const originToCLIType: Record<string, string> = {
      agent: "agent_log",
      all: "all_logs",
      system: "system_log",
      task: "task_log",
    };
    const taskType = originToCLIType[origin] ?? "task_log";
    return `evergreen task build TaskLogs --task_id ${taskID} --execution ${execution} --type ${taskType} --o output.txt`;
  }
  if (logType === LogTypes.EVERGREEN_TEST_LOGS) {
    if (!logPath || logPath === "") {
      return null;
    }
    return `evergreen task build TestLogs --task_id ${taskID} --execution ${execution} --log_path ${logPath} --o output.txt`;
  }

  // Unsupported log type.
  return null;
};

const Container = styled.div`
  margin-top: ${size.xs};
  width: 100%;
`;

const StyledCopyable = styled(Copyable)`
  width: 100%;
`;

export default CliCommandButton;
