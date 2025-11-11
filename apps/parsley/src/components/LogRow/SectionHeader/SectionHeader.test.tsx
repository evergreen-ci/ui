import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import * as analytics from "analytics";
import { SectionStatus } from "constants/logs";
import * as logContext from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import SectionHeader from ".";

const wrapper = logContextWrapper();

describe("SectionHeader", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        toggleFunctionSection: vi.fn(),
      },
    }));
  });
  it("displays function name", () => {
    renderWithRouterMatch(
      <SectionHeader {...sectionHeaderProps} functionName="load_data" />,
      { wrapper },
    );
    expect(screen.getByText("Function: load_data")).toBeVisible();
  });

  it("displays checkmark icon if status is passing", () => {
    renderWithRouterMatch(
      <SectionHeader {...sectionHeaderProps} status={SectionStatus.Pass} />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-status-pass")).toBeVisible();
  });

  it("displays X icon if status is failing", () => {
    renderWithRouterMatch(
      <SectionHeader {...sectionHeaderProps} status={SectionStatus.Fail} />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-status-fail")).toBeVisible();
  });

  it("renders as opened if 'open' prop is true", async () => {
    renderWithRouterMatch(<SectionHeader {...sectionHeaderProps} open />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("renders as closed if 'open' prop is false", async () => {
    renderWithRouterMatch(
      <SectionHeader {...sectionHeaderProps} open={false} />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("should call onOpen function when 'open' button is clicked and send analytics events", async () => {
    const user = userEvent.setup();
    const mockedAnalytics = vi.spyOn(analytics, "useLogWindowAnalytics");
    const sendEventMock = vi.fn();
    mockedAnalytics.mockImplementation(() => ({
      sendEvent: sendEventMock,
    }));
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    const toggleFunctionSectionMock = vi.fn();
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        toggleFunctionSection: toggleFunctionSectionMock,
      },
    }));
    renderWithRouterMatch(<SectionHeader {...sectionHeaderProps} />, {
      wrapper,
    });
    const openButton = screen.getByDataCy("caret-toggle");
    await user.click(openButton);
    expect(sendEventMock).toHaveBeenCalledTimes(1);
    expect(sendEventMock).toHaveBeenCalledWith({
      name: "Toggled section caret",
      "section.name": "load_data",
      "section.nested": false,
      "section.open": true,
      "section.status": "pass",
      "section.type": "function",
    });
    expect(toggleFunctionSectionMock).toHaveBeenCalledTimes(1);
    expect(toggleFunctionSectionMock).toHaveBeenCalledWith({
      functionID: "function-4",
      isOpen: true,
    });
  });

  it("open and close state is controlled by the 'open' prop", async () => {
    const { rerender } = renderWithRouterMatch(
      <SectionHeader {...sectionHeaderProps} open={false} />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    rerender(<SectionHeader {...sectionHeaderProps} open />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    rerender(<SectionHeader {...sectionHeaderProps} open={false} />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

const sectionHeaderProps = {
  functionID: "function-4",
  functionName: "load_data",
  lineIndex: 0,
  open: false,
  status: SectionStatus.Pass,
};
