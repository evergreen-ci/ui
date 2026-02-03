import {
  RenderFakeToastContext as InitializeFakeToastContext,
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import * as analytics from "analytics";
import { SectionStatus } from "constants/logs";
import * as logContext from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import {
  sectionStateAllClosed,
  sectionStateAllOpen,
  sectionStateSomeOpen,
} from "hooks/useSections/testData";
import { SubsectionControls } from "./SubsectionControls";

const wrapper = logContextWrapper();

describe("SectionControls", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
  });

  it("Should not render 'Open subsections' when all subsections belonging to the function are open", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test
      sectioning: {
        sectionState: sectionStateAllOpen,
        sectioningEnabled: true,
        toggleAllSections: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SubsectionControls {...props} />, { wrapper });
    expect(screen.queryByText("Open subsections")).toBeNull();
    expect(screen.queryByText("Close subsections")).toBeVisible();
  });
  it("Should not render 'Close subsections' when all subsections belonging to the function are closed", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateAllClosed,
        sectioningEnabled: true,
        toggleAllCommandsInFunction: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SubsectionControls {...props} />, { wrapper });
    expect(screen.queryByText("Open subsections")).toBeVisible();
    expect(screen.queryByText("Close subsections")).toBeNull();
  });
  it("Should render 'Open subsections' and 'Close subsections' buttons when some sections are open and some are closed", () => {
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateSomeOpen,
        sectioningEnabled: true,
        toggleAllCommandsInFunction: vi.fn(),
      },
    }));
    renderWithRouterMatch(<SubsectionControls {...props} />, { wrapper });
    expect(screen.queryByText("Open subsections")).toBeVisible();
    expect(screen.queryByText("Close subsections")).toBeVisible();
  });

  it("Clicking on buttons calls 'toggleAllCommandsInFunction' with correct parameters and sends analytics events", async () => {
    const user = userEvent.setup();
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    const mockedAnalytics = vi.spyOn(analytics, "useLogWindowAnalytics");
    const sendEventMock = vi.fn();
    mockedAnalytics.mockImplementation(() => ({
      sendEvent: sendEventMock,
    }));
    const toggleAllCommandsInFunctionMock = vi.fn();
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        sectionState: sectionStateSomeOpen,
        sectioningEnabled: true,
        toggleAllCommandsInFunction: toggleAllCommandsInFunctionMock,
      },
    }));
    renderWithRouterMatch(<SubsectionControls {...props} />, { wrapper });
    expect(screen.getByDataCy("open-subsections-btn")).toBeVisible();
    await user.click(screen.getByDataCy("open-subsections-btn"));
    expect(sendEventMock).toHaveBeenCalledOnce();
    expect(sendEventMock).toHaveBeenCalledWith({
      name: "Clicked open subsections button",
      "section.function.name": "funcName",
      "section.function.status": "pass",
      "section.function.was_closed": false,
    });
    expect(toggleAllCommandsInFunctionMock).toHaveBeenCalledOnce();
    expect(toggleAllCommandsInFunctionMock).toHaveBeenCalledWith(
      "function-1",
      true,
    );
    await user.click(screen.getByDataCy("close-subsections-btn"));
    await waitFor(() =>
      expect(toggleAllCommandsInFunctionMock).toHaveBeenCalledWith(
        "function-1",
        false,
      ),
    );
    expect(sendEventMock).toHaveBeenCalledTimes(2);
    expect(sendEventMock).toHaveBeenCalledWith({
      name: "Clicked close subsections button",
      "section.function.name": "funcName",
      "section.function.status": "pass",
    });
  });
});

const props = {
  functionID: "function-1",
  functionName: "funcName",
  status: SectionStatus.Pass,
};
