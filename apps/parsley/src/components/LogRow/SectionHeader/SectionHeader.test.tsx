import { SectionStatus } from "constants/logs";
import { render, screen, userEvent } from "test_utils";
import SectionHeader from ".";

describe("sectionHeader", () => {
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
});

const sectionHeaderProps = {
  defaultOpen: false,
  functionName: "load_data",
  lineIndex: 0,
  onFocus: vi.fn(),
  onOpen: vi.fn(),
  status: SectionStatus.Pass,
};
