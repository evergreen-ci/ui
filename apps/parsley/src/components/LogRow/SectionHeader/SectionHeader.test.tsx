import {
  RenderFakeToastContext as InitializeFakeToastContext,
  renderWithRouterMatch,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import * as analytics from "analytics";
import * as logContext from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import { RowType } from "types/logs";
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
    renderWithRouterMatch(<SectionHeader {...sectionHeaderProps} />, {
      wrapper,
    });
    expect(
      screen.getByText(`Function: ${baseSectionHeaderLine.functionName}`),
    ).toBeVisible();
  });

  it("displays checkmark icon if status is passing", () => {
    renderWithRouterMatch(
      <SectionHeader {...sectionHeaderProps} failingLine={15} />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-status-pass")).toBeVisible();
  });

  it("displays X icon if status is failing", () => {
    renderWithRouterMatch(
      <SectionHeader {...sectionHeaderProps} failingLine={5} />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-status-fail")).toBeVisible();
  });

  it("renders as opened if 'open' prop is true", async () => {
    renderWithRouterMatch(
      <SectionHeader
        {...sectionHeaderProps}
        sectionHeaderLine={{ ...baseSectionHeaderLine, isOpen: true }}
      />,
    );
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("renders as closed if 'open' prop is false", async () => {
    renderWithRouterMatch(<SectionHeader {...sectionHeaderProps} />, {
      wrapper,
    });
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
      <SectionHeader {...sectionHeaderProps} />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    rerender(
      <SectionHeader
        {...sectionHeaderProps}
        sectionHeaderLine={{ ...baseSectionHeaderLine, isOpen: true }}
      />,
    );
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    rerender(<SectionHeader {...sectionHeaderProps} />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

const baseSectionHeaderLine = {
  functionID: "function-4",
  functionName: "load_data",
  isOpen: false,
  range: { end: 10, start: 0 },
  rowType: RowType.SectionHeader as const,
};

const sectionHeaderProps = {
  failingLine: undefined,
  lineIndex: 0,
  sectionHeaderLine: baseSectionHeaderLine,
};
