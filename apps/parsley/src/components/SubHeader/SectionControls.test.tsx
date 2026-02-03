import {
  RenderFakeToastContext as InitializeFakeToastContext,
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import * as analytics from "analytics";
import * as logContext from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import {
  sectionStateAllClosed,
  sectionStateAllOpen,
  sectionStateSomeOpen,
} from "hooks/useSections/testData";
import { SectionControls } from "./SectionControls";

const wrapper = logContextWrapper();

describe("SectionControls", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
  });

  it("Should not render 'Open all sections' and should render when all sections are open", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.ddd
      sectioning: {
        sectionState: sectionStateAllOpen,
        sectioningEnabled: true,
        toggleAllSections: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SectionControls />, { wrapper });
    expect(screen.queryByText("Open all sections")).toBeNull();
    expect(screen.queryByText("Close all sections")).toBeVisible();
  });
  it("Should not render 'Close all sections' and should render when all sections are closed", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateAllClosed,
        sectioningEnabled: true,
        toggleAllSections: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SectionControls />, { wrapper });
    expect(screen.queryByText("Open all sections")).toBeVisible();
    expect(screen.queryByText("Close all sections")).toBeNull();
  });
  it("Should not render any buttons when sectioning is disabled", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateAllClosed,
        sectioningEnabled: false,
        toggleAllSections: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SectionControls />, { wrapper });
    expect(screen.queryByText("Open all sections")).toBeNull();
    expect(screen.queryByText("Close all sections")).toBeNull();
  });
  it("Should render 'Open all sections' and 'Close all sections' buttons when some sections are open and some are closed", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateSomeOpen,
        sectioningEnabled: true,
        toggleAllSections: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SectionControls />, { wrapper });
    expect(screen.queryByText("Open all sections")).toBeVisible();
    expect(screen.queryByText("Close all sections")).toBeVisible();
  });

  it("Clicking on buttons calls 'toggleAllSections' with correct parameters and sends analytics events", async () => {
    const user = userEvent.setup();
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    const mockedAnalytics = vi.spyOn(analytics, "useLogWindowAnalytics");
    const sendEventMock = vi.fn();
    mockedAnalytics.mockImplementation(() => ({
      sendEvent: sendEventMock,
    }));
    const toggleAllSectionsMock = vi.fn();
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateSomeOpen,
        sectioningEnabled: true,
        toggleAllSections: toggleAllSectionsMock,
      },
    }));
    renderWithRouterMatch(<SectionControls />, { wrapper });
    expect(screen.getByDataCy("open-all-sections-btn")).toBeVisible();
    await user.click(screen.getByDataCy("open-all-sections-btn"));
    expect(sendEventMock).toHaveBeenCalledOnce();
    expect(sendEventMock).toHaveBeenCalledWith({
      name: "Clicked open all sections button",
    });
    expect(toggleAllSectionsMock).toHaveBeenCalledOnce();
    await user.click(screen.getByDataCy("close-all-sections-btn"));
    await waitFor(() =>
      expect(toggleAllSectionsMock).toHaveBeenCalledWith(false),
    );
    expect(sendEventMock).toHaveBeenCalledTimes(2);
    expect(sendEventMock).toHaveBeenCalledWith({
      name: "Clicked close all sections button",
    });
  });
});
