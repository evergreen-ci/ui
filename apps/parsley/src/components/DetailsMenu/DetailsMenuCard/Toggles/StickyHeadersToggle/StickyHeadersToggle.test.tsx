import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { SECTIONS_ENABLED, STICKY_HEADERS } from "constants/storageKeys";
import { LogContextProvider, useLogContext } from "context/LogContext";
import StickyHeadersToggle from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider>{children}</LogContextProvider>
);

describe("sticky headers toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(STICKY_HEADERS, "true");
    InitializeFakeToastContext();
  });

  it("defaults to 'false' if stored value is unset", () => {
    localStorage.clear();
    render(<StickyHeadersToggle />, { wrapper });
    const stickyHeadersToggle = screen.getByDataCy("sticky-headers-toggle");
    expect(stickyHeadersToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from localStorage properly", () => {
    render(<StickyHeadersToggle />, { wrapper });
    const stickyHeadersToggle = screen.getByDataCy("sticky-headers-toggle");
    expect(stickyHeadersToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should not update the URL when clicked", async () => {
    const user = userEvent.setup();
    const { router } = render(<StickyHeadersToggle />, { wrapper });
    const stickyHeadersToggle = screen.getByDataCy("sticky-headers-toggle");
    expect(stickyHeadersToggle).toHaveAttribute("aria-checked", "true");
    await user.click(stickyHeadersToggle);
    expect(router.state.location.search).toBe("");
  });

  it("should enable toggle when both sectioning is enabled", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <StickyHeadersToggle />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({
        logType: LogTypes.EVERGREEN_TASK_LOGS,
        renderingType: LogRenderingTypes.Default,
      });
    });
    await waitFor(() => {
      expect(hook.current.sectioning.sectioningEnabled).toBe(true);
    });
    await waitFor(() => {
      const stickyHeadersToggle = screen.getByDataCy("sticky-headers-toggle");
      expect(stickyHeadersToggle).toHaveAttribute("aria-disabled", "false");
    });
  });

  it("should disable toggle if sectioning is disabled", async () => {
    localStorage.setItem(SECTIONS_ENABLED, "false");
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <StickyHeadersToggle />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({
        logType: LogTypes.EVERGREEN_TASK_LOGS,
        renderingType: LogRenderingTypes.Default,
      });
    });
    await waitFor(() => {
      expect(hook.current.sectioning.sectioningEnabled).toBe(false);
    });
    await waitFor(() => {
      const stickyHeadersToggle = screen.getByDataCy("sticky-headers-toggle");
      expect(stickyHeadersToggle).toHaveAttribute("aria-disabled", "true");
    });
  });
});
