import { render, screen, userEvent } from "test_utils";
import SubsectionHeader from ".";

describe("SubsectionHeader", () => {
  it("displays command name", () => {
    render(<SubsectionHeader {...sectionHeaderProps} />);
    expect(screen.getByText("Command: shell.exec")).toBeVisible();
  });

  it("renders as opened if 'open' prop is true", async () => {
    render(<SubsectionHeader {...sectionHeaderProps} open />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("renders as closed if 'open' prop is false", async () => {
    render(<SubsectionHeader {...sectionHeaderProps} open={false} />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("should call onOpen function when 'open' button is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<SubsectionHeader {...sectionHeaderProps} onToggle={onToggle} />);
    const openButton = screen.getByDataCy("caret-toggle");
    await user.click(openButton);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith({
      commandID: "command-1",
      functionID: "function-1",
      isOpen: true,
    });
  });

  it("open and close state is controlled by the 'open' prop", async () => {
    const { rerender } = render(
      <SubsectionHeader {...sectionHeaderProps} open={false} />,
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
};
