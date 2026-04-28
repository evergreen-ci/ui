import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { LogTypes } from "constants/enums";
import { JUMP_TO_FAILING_LINE_ENABLED } from "constants/storageKeys";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import JumpToFailingLineToggle from ".";

const wrapper = logContextWrapper();

describe("jump to failing line toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    InitializeFakeToastContext();
  });

  it("defaults to 'true' when localStorage is unset", () => {
    render(<JumpToFailingLineToggle />, { wrapper });
    const jumpToFailingLineToggle = screen.getByDataCy(
      "jump-to-failing-line-toggle",
    );
    expect(jumpToFailingLineToggle).toHaveAttribute("aria-checked", "true");
  });

  it("reads from localStorage when set to 'false'", () => {
    localStorage.setItem(JUMP_TO_FAILING_LINE_ENABLED, "false");
    render(<JumpToFailingLineToggle />, { wrapper });
    const jumpToFailingLineToggle = screen.getByDataCy(
      "jump-to-failing-line-toggle",
    );
    expect(jumpToFailingLineToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should disable toggle if logType is not Evergreen task logs", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <JumpToFailingLineToggle />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.EVERGREEN_TEST_LOGS });
    });
    const jumpToFailingLineToggle = screen.getByDataCy(
      "jump-to-failing-line-toggle",
    );
    expect(jumpToFailingLineToggle).toHaveAttribute("aria-disabled", "true");
  });

  it("should enable toggle if logType is Evergreen task logs", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <JumpToFailingLineToggle />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.EVERGREEN_TASK_LOGS });
    });
    const jumpToFailingLineToggle = screen.getByDataCy(
      "jump-to-failing-line-toggle",
    );
    expect(jumpToFailingLineToggle).toHaveAttribute("aria-disabled", "false");
  });

  it("should persist changes to localStorage without updating the URL", async () => {
    const user = userEvent.setup();

    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <JumpToFailingLineToggle />,
    );
    const { router } = render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.EVERGREEN_TASK_LOGS });
    });

    const jumpToFailingLineToggle = screen.getByDataCy(
      "jump-to-failing-line-toggle",
    );
    expect(jumpToFailingLineToggle).toHaveAttribute("aria-checked", "true");
    await user.click(jumpToFailingLineToggle);
    expect(jumpToFailingLineToggle).toHaveAttribute("aria-checked", "false");
    expect(localStorage.getItem(JUMP_TO_FAILING_LINE_ENABLED)).toBe("false");
    expect(router.state.location.search).toBe("");
  });
});
