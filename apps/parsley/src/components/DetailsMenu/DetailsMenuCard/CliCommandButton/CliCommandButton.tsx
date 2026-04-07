import styled from "@emotion/styled";
import Copyable from "@leafygreen-ui/copyable";
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
  const { execution, logType, taskID, testID } = logMetadata;
  if (!logType || !taskID || execution == null) {
    return null;
  }

  // Based on documentation at
  // https://docs.devprod.prod.corp.mongodb.com/parsley/Downloading-Logs.
  if (logType === LogTypes.EVERGREEN_TASK_LOGS) {
    return `evergreen task build TaskLogs --task_id ${taskID} --execution ${execution} --type task_log --o output.txt`;
  }
  if (logType === LogTypes.EVERGREEN_TEST_LOGS) {
    if (!testID) {
      return null;
    }
    return `evergreen task build TestLogs --task_id ${taskID} --execution ${execution} --log_path ${testID} --o output.txt`;
  }

  // Unsupported log type.
  return null;
};

const Container = styled.div`
  margin-top: 8px;
  width: 100%;
`;

const StyledCopyable = styled(Copyable)`
  width: 100%;
`;

export default CliCommandButton;
