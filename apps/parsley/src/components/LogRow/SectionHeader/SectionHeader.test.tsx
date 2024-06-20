import { SectionStatus } from "constants/logs";
import { render, screen, userEvent } from "test_utils";
import SectionHeader from ".";

describe("SectionHeader", () => {
  it("displays function name", () => {
    render(<SectionHeader {...sectionHeaderProps} functionName="load_data" />);
    expect(screen.getByText("Function: load_data")).toBeVisible();
  });

  it("displays checkmark icon if status is passing", () => {
    render(
      <SectionHeader {...sectionHeaderProps} status={SectionStatus.Pass} />,
    );
    expect(
      screen.getByLabelText("Checkmark With Circle Icon"),
    ).toBeInTheDocument();
  });

  it("displays X icon if status is failing", () => {
    render(
      <SectionHeader {...sectionHeaderProps} status={SectionStatus.Fail} />,
    );
    expect(screen.getByLabelText("XWith Circle Icon")).toBeInTheDocument();
  });

  it("renders as opened if 'open' prop is true", async () => {
    render(<SectionHeader {...sectionHeaderProps} open />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("renders as closed if 'open' prop is false", async () => {
    render(<SectionHeader {...sectionHeaderProps} open={false} />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("should call onOpen function when 'open' button is clicked", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<SectionHeader {...sectionHeaderProps} onOpen={onOpen} />);
    const openButton = screen.getByDataCy("section-header-caret");
    await user.click(openButton);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith("load_data", true);
  });

  it("open and close state is controlled by the 'open' prop", async () => {
    const { rerender } = render(
      <SectionHeader {...sectionHeaderProps} open={false} />,
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
  functionName: "load_data",
  lineIndex: 0,
  onOpen: vi.fn(),
  open: false,
  status: SectionStatus.Pass,
};
