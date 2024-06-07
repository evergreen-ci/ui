import { LogTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from "context/LogContext";
import {
  act,
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import SectionsToggle from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("sections toggle", () => {
  it("should render as checked when 'checked' prop is true", () => {
    render(<SectionsToggle checked updateSettings={vi.fn()} />, { wrapper });
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should render as unchecked when 'checked' prop is false", () => {
    render(<SectionsToggle checked={false} updateSettings={vi.fn()} />, {
      wrapper,
    });
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should disable toggle if logType is not Evergreen task logs", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <SectionsToggle checked updateSettings={vi.fn()} />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.LOGKEEPER_LOGS });
    });
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-disabled", "true");
  });

  it("should enable toggle if logType is Evergreen task logs", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <SectionsToggle checked updateSettings={vi.fn()} />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.EVERGREEN_TASK_LOGS });
    });
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-disabled", "false");
  });

  it("should call update function with correct parameters, without updating the URL", async () => {
    const user = userEvent.setup();
    const updateSettings = vi.fn();

    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <SectionsToggle checked updateSettings={updateSettings} />,
    );
    const { router } = render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.EVERGREEN_TASK_LOGS });
    });

    const sectionsToggle = screen.getByDataCy("sections-toggle");
    await user.click(sectionsToggle);
    expect(updateSettings).toHaveBeenCalledTimes(1);
    expect(updateSettings).toHaveBeenCalledWith({
      sectionsEnabled: false,
    });
    expect(router.state.location.search).toBe("");
  });
});
