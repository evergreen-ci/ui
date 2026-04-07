import {
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
} from "@evg-ui/lib/test_utils";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import CliCommandButton from "./CliCommandButton";

const wrapper = logContextWrapper();

describe("CliCommandButton", () => {
  it("does not render when there is no log metadata", () => {
    render(<CliCommandButton />, { wrapper });

    expect(
      screen.queryByLabelText("Fetch the log via Evergreen CLI"),
    ).not.toBeInTheDocument();
  });

  it("does not render for non-Evergreen logs", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <CliCommandButton />,
    );

    render(<Component />, { wrapper });

    act(() => {
      hook.current.setLogMetadata({
        logType: LogTypes.LOCAL_UPLOAD,
      });
    });

    expect(
      screen.queryByLabelText("Fetch the log via Evergreen CLI"),
    ).not.toBeInTheDocument();
  });

  it("does not render if taskID or execution is missing", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <CliCommandButton />,
    );

    render(<Component />, { wrapper });

    // Missing taskID
    act(() => {
      hook.current.setLogMetadata({
        execution: "0",
        logType: LogTypes.EVERGREEN_TASK_LOGS,
      });
    });

    expect(
      screen.queryByLabelText("Fetch the log via Evergreen CLI"),
    ).not.toBeInTheDocument();

    // Missing execution
    act(() => {
      hook.current.setLogMetadata({
        logType: LogTypes.EVERGREEN_TASK_LOGS,
        taskID: "task-abc",
      });
    });

    expect(
      screen.queryByLabelText("Fetch the log via Evergreen CLI"),
    ).not.toBeInTheDocument();
  });

  it("renders a copyable Evergreen CLI command for Evergreen task logs", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <CliCommandButton />,
    );

    render(<Component />, { wrapper });

    act(() => {
      hook.current.setLogMetadata({
        execution: "2",
        logType: LogTypes.EVERGREEN_TASK_LOGS,
        taskID: "task-abc",
      });
    });

    const copyable = screen.getByLabelText("Fetch the log via Evergreen CLI");
    expect(copyable).toBeInTheDocument();
    expect(copyable).toHaveTextContent(
      "evergreen task build TaskLogs --task_id task-abc --execution 2 --type task_log --o output.txt",
    );
  });

  it("renders a copyable Evergreen CLI command for Evergreen test logs", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <CliCommandButton />,
    );

    render(<Component />, { wrapper });

    act(() => {
      hook.current.setLogMetadata({
        execution: "1",
        logType: LogTypes.EVERGREEN_TEST_LOGS,
        taskID: "evergreen_task_id",
        testID: "AFakeTest",
      });
    });

    const copyable = screen.getByDataCy("cli-command-copyable");
    expect(copyable).toBeInTheDocument();
    expect(copyable).toHaveTextContent(
      "evergreen task build TestLogs --task_id evergreen_task_id --execution 1 --log_path AFakeTest --o output.txt",
    );
  });
});
