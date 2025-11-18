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
import SubsectionHeader from ".";

const wrapper = logContextWrapper();

describe("SubsectionHeader", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        toggleCommandSection: vi.fn(),
      },
    }));
  });
  it("displays command name", () => {
    renderWithRouterMatch(<SubsectionHeader {...subsectionHeaderProps} />, {
      wrapper,
    });
    expect(screen.getByText("Command: shell.exec (step 1 of 4)")).toBeVisible();
  });

  it("displays command description if present", () => {
    renderWithRouterMatch(
      <SubsectionHeader
        {...subsectionHeaderProps}
        commandDescription="doing stuff"
      />,
      {
        wrapper,
      },
    );
    expect(
      screen.getByText("Command: shell.exec (step 1 of 4) — doing stuff"),
    ).toBeVisible();
  });

  it("renders as opened if 'open' prop is true", async () => {
    renderWithRouterMatch(
      <SubsectionHeader {...subsectionHeaderProps} open />,
      {
        wrapper,
      },
    );
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("renders as closed if 'open' prop is false", async () => {
    renderWithRouterMatch(
      <SubsectionHeader {...subsectionHeaderProps} open={false} />,
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
        toggleCommandSection: toggleFunctionSectionMock,
      },
    }));
    renderWithRouterMatch(<SubsectionHeader {...subsectionHeaderProps} />, {
      wrapper,
    });
    const openButton = screen.getByDataCy("caret-toggle");
    await user.click(openButton);
    expect(toggleFunctionSectionMock).toHaveBeenCalledTimes(1);
    expect(toggleFunctionSectionMock).toHaveBeenCalledWith({
      commandID: "command-1",
      functionID: "function-1",
      isOpen: true,
    });
    expect(sendEventMock).toHaveBeenCalledTimes(1);
    expect(sendEventMock).toHaveBeenCalledWith({
      name: "Toggled section caret",
      "section.name": "shell.exec",
      "section.nested": true,
      "section.open": true,
      "section.status": undefined,
      "section.type": "command",
    });
  });

  it("open and close state is controlled by the 'open' prop", async () => {
    const { rerender } = renderWithRouterMatch(
      <SubsectionHeader {...subsectionHeaderProps} open={false} />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    rerender(<SubsectionHeader {...subsectionHeaderProps} open />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    rerender(<SubsectionHeader {...subsectionHeaderProps} open={false} />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
  it("should show status icon if status is defined and the opposite otherwise", () => {
    const { rerender } = renderWithRouterMatch(
      <SubsectionHeader
        {...subsectionHeaderProps}
        status={SectionStatus.Pass}
      />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-status-pass")).toBeVisible();
    rerender(<SubsectionHeader {...subsectionHeaderProps} />);
    expect(screen.queryByDataCy("section-status-pass")).not.toBeInTheDocument();
  });
});

const subsectionHeaderProps = {
  commandDescription: undefined,
  commandID: "command-1",
  commandName: "shell.exec",
  functionID: "function-1",
  isTopLevelCommand: false,
  lineIndex: 0,
  onToggle: vi.fn(),
  open: false,
  status: undefined,
  step: "1 of 4",
};
