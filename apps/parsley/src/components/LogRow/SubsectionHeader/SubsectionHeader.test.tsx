import * as logContext from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import { RenderFakeToastContext as InitializeFakeToastContext } from "context/toast/__mocks__";
import { renderWithRouterMatch, screen, userEvent } from "test_utils";
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
    renderWithRouterMatch(<SubsectionHeader {...sectionHeaderProps} />, {
      wrapper,
    });
    expect(screen.getByText("Command: shell.exec (step 1 of 4)")).toBeVisible();
  });

  it("renders as opened if 'open' prop is true", async () => {
    renderWithRouterMatch(<SubsectionHeader {...sectionHeaderProps} open />, {
      wrapper,
    });
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("renders as closed if 'open' prop is false", async () => {
    renderWithRouterMatch(
      <SubsectionHeader {...sectionHeaderProps} open={false} />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("should call onOpen function when 'open' button is clicked", async () => {
    const user = userEvent.setup();
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    const toggleFunctionSectionMock = vi.fn();
    mockedLogContext.mockImplementation(() => ({
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      sectioning: {
        toggleCommandSection: toggleFunctionSectionMock,
      },
    }));
    renderWithRouterMatch(<SubsectionHeader {...sectionHeaderProps} />, {
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
  });

  it("open and close state is controlled by the 'open' prop", async () => {
    const { rerender } = renderWithRouterMatch(
      <SubsectionHeader {...sectionHeaderProps} open={false} />,
      { wrapper },
    );
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    rerender(<SubsectionHeader {...sectionHeaderProps} open />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    rerender(<SubsectionHeader {...sectionHeaderProps} open={false} />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

const sectionHeaderProps = {
  commandID: "command-1",
  commandName: "shell.exec",
  functionID: "function-1",
  lineIndex: 0,
  onToggle: vi.fn(),
  open: false,
  step: "1 of 4",
};
