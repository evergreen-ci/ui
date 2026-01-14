import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from "context/LogContext";
import {
  parsleySettingsMock,
  parsleySettingsMockSectionsDisabled,
} from "test_data/parsleySettings";
import StickyHeadersToggle from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const sectionsEnabledWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <MockedProvider mocks={[parsleySettingsMock]}>
    <LogContextProvider>{children}</LogContextProvider>
  </MockedProvider>
);

const sectionsDisabledWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <MockedProvider mocks={[parsleySettingsMockSectionsDisabled]}>
    <LogContextProvider>{children}</LogContextProvider>
  </MockedProvider>
);

describe("sticky headers toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
    InitializeFakeToastContext();
  });

  it("defaults to 'false' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<StickyHeadersToggle />, { wrapper: sectionsEnabledWrapper });
    const stickyHeadersToggle = screen.getByDataCy("sticky-headers-toggle");
    expect(stickyHeadersToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<StickyHeadersToggle />, { wrapper: sectionsEnabledWrapper });
    const stickyHeadersToggle = screen.getByDataCy("sticky-headers-toggle");
    expect(stickyHeadersToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should not update the URL when clicked", async () => {
    const user = userEvent.setup();
    const { router } = render(<StickyHeadersToggle />, {
      wrapper: sectionsEnabledWrapper,
    });
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
    render(<Component />, { wrapper: sectionsEnabledWrapper });
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
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <StickyHeadersToggle />,
    );
    render(<Component />, { wrapper: sectionsDisabledWrapper });
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
