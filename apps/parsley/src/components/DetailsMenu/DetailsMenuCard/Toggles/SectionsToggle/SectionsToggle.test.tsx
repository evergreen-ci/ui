import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { LogTypes } from "constants/enums";
import { SECTIONS_ENABLED } from "constants/storageKeys";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import SectionsToggle from ".";

const wrapper = logContextWrapper();

describe("sections toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    InitializeFakeToastContext();
  });

  it("defaults to 'true' when localStorage is unset", () => {
    render(<SectionsToggle />, { wrapper });
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-checked", "true");
  });

  it("reads from localStorage when set to 'false'", () => {
    localStorage.setItem(SECTIONS_ENABLED, "false");
    render(<SectionsToggle />, { wrapper });
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should disable toggle if logType is not Evergreen task logs", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <SectionsToggle />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({
        logType: LogTypes.EVERGREEN_COMPLETE_LOGS,
      });
    });
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-disabled", "true");
  });

  it("should enable toggle if logType is Evergreen task logs", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <SectionsToggle />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.EVERGREEN_TASK_LOGS });
    });
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-disabled", "false");
  });

  it("should persist changes to localStorage without updating the URL", async () => {
    const user = userEvent.setup();

    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <SectionsToggle />,
    );
    const { router } = render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.EVERGREEN_TASK_LOGS });
    });

    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-checked", "true");
    await user.click(sectionsToggle);
    expect(sectionsToggle).toHaveAttribute("aria-checked", "false");
    expect(localStorage.getItem(SECTIONS_ENABLED)).toBe("false");
    expect(router.state.location.search).toBe("");
  });
});
