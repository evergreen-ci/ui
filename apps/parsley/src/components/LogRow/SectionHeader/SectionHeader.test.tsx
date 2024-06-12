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
    const openButton = screen.getByRole("button", {
      name: "Open",
    });
    await user.click(openButton);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith("load_data");
  });

  it("should call onFocus function when 'focus' button is clicked", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<SectionHeader {...sectionHeaderProps} onFocus={onFocus} />);
    const focusButton = screen.getByRole("button", {
      name: "Focus",
    });
    await user.click(focusButton);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledWith("load_data");
  });

  it("can open and close the section header using 'open' and 'close' buttons", async () => {
    const user = userEvent.setup();
    render(<SectionHeader {...sectionHeaderProps} open={false} />);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    const openButton = screen.getByRole("button", {
      name: "Open",
    });
    await user.click(openButton);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    const closeButton = screen.getByRole("button", {
      name: "Close",
    });
    await user.click(closeButton);
    expect(screen.getByDataCy("section-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

const sectionHeaderProps = {
  functionName: "load_data",
  lineIndex: 0,
  onFocus: vi.fn(),
  onOpen: vi.fn(),
  open: false,
  status: SectionStatus.Pass,
};
