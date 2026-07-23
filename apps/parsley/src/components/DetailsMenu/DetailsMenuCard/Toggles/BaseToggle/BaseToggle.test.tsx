import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import BaseToggle from ".";

describe("base toggle", () => {
  it("properly renders labels", () => {
    render(
      <BaseToggle
        data-testid="toggle"
        label="Test Label"
        leftLabel="Left"
        onChange={vi.fn()}
        rightLabel="Right"
        tooltip="test tooltip"
        value
      />,
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("calls the onChange function with the correct parameters", async () => {
    const user = userEvent.setup();
    const toggleFunc = vi.fn();
    render(
      <BaseToggle
        data-testid="toggle"
        label="test"
        onChange={toggleFunc}
        tooltip="test tooltip"
        value={false}
      />,
    );
    const toggle = screen.getByDataTestId("toggle");
    await user.click(toggle);

    expect(toggleFunc).toHaveBeenCalledTimes(1);
    // The second parameter is a mouseEvent that can be ignored.
    expect(toggleFunc).toHaveBeenCalledWith(true, expect.anything());
  });

  it("should be possible to disable the toggle", () => {
    render(
      <BaseToggle
        data-testid="toggle"
        disabled
        label="Test Label"
        leftLabel="Left"
        onChange={vi.fn()}
        rightLabel="Right"
        tooltip="test tooltip"
        value
      />,
    );
    expect(screen.getByDataTestId("toggle")).toBeDisabled();
  });
});
