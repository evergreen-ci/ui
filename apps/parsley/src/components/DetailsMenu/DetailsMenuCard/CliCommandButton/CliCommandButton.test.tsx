import React from "react";
import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import type { LogMetadata } from "context/LogContext/types";
import CliCommandButton from "./CliCommandButton";

const wrapper = logContextWrapper();

const WithLogMetadata: React.FC<{ metadata: LogMetadata }> = ({ metadata }) => {
  const { setLogMetadata } = useLogContext();
  React.useEffect(() => {
    setLogMetadata(metadata);
  }, [metadata, setLogMetadata]);
  return <CliCommandButton />;
};

describe("CliCommandButton", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
  });

  it("does not render when there is no log metadata", () => {
    render(<CliCommandButton />, { wrapper });
    expect(
      screen.queryByLabelText("Fetch the log via Evergreen CLI"),
    ).not.toBeInTheDocument();
  });

  it("does not render for non-Evergreen logs", () => {
    render(
      <WithLogMetadata
        metadata={{
          logType: LogTypes.LOCAL_UPLOAD,
        }}
      />,
      { wrapper },
    );
    expect(
      screen.queryByLabelText("Fetch the log via Evergreen CLI"),
    ).not.toBeInTheDocument();
  });

  it("does not render if taskID or execution is missing", () => {
    // Missing taskID
    render(
      <WithLogMetadata
        metadata={{
          execution: "0",
          logType: LogTypes.EVERGREEN_TASK_LOGS,
        }}
      />,
      { wrapper },
    );
    expect(
      screen.queryByLabelText("Fetch the log via Evergreen CLI"),
    ).not.toBeInTheDocument();

    // Missing execution
    render(
      <WithLogMetadata
        metadata={{
          logType: LogTypes.EVERGREEN_TASK_LOGS,
          taskID: "task-abc",
        }}
      />,
      { wrapper },
    );
    expect(
      screen.queryByLabelText("Fetch the log via Evergreen CLI"),
    ).not.toBeInTheDocument();
  });

  it("renders a copyable Evergreen CLI command for Evergreen task logs", () => {
    render(
      <WithLogMetadata
        metadata={{
          execution: "2",
          logType: LogTypes.EVERGREEN_TASK_LOGS,
          taskID: "task-abc",
        }}
      />,
      { wrapper },
    );
    const command =
      "evergreen task build TaskLogs --task_id task-abc --execution 2 --type task_log --o output.txt";
    expect(screen.getByText(command)).toBeInTheDocument();
  });

  it("renders a copyable Evergreen CLI command for Evergreen test logs", () => {
    render(
      <WithLogMetadata
        metadata={{
          execution: "1",
          logPath: "AFakeTest",
          logType: LogTypes.EVERGREEN_TEST_LOGS,
          taskID: "spruce_ubuntu_check_codegen_1234",
        }}
      />,
      { wrapper },
    );
    const command =
      "evergreen task build TestLogs --task_id spruce_ubuntu_check_codegen_1234 --execution 1 --log_path AFakeTest --o output.txt";
    expect(screen.getByText(command)).toBeInTheDocument();
  });
});
