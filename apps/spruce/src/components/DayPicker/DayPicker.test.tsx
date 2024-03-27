import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { DayPicker } from ".";

const defaultState = [false, true, true, true, true, true, false];

describe("daypicker", () => {
  it("renders an unselected daypicker", () => {
    const onChange = jest.fn();
    render(<DayPicker onChange={onChange} />);
    const days = screen.getAllByRole("checkbox");
    expect(days).toHaveLength(7);
    days.forEach((day) => {
      expect(day).toHaveAttribute("aria-checked", "false");
    });
  });

  it("renders a daypicker with default days selected", () => {
    const onChange = jest.fn();
    render(<DayPicker defaultState={defaultState} onChange={onChange} />);

    const days = screen.getAllByRole("checkbox");
    expect(days).toHaveLength(7);
    expect(days[0]).toHaveAttribute("aria-checked", "false");
    expect(days[6]).toHaveAttribute("aria-checked", "false");

    expect(days[1]).toHaveAttribute("aria-checked", "true");
    expect(days[2]).toHaveAttribute("aria-checked", "true");
    expect(days[3]).toHaveAttribute("aria-checked", "true");
    expect(days[4]).toHaveAttribute("aria-checked", "true");
    expect(days[5]).toHaveAttribute("aria-checked", "true");
  });

  it("toggles selected days on click", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<DayPicker onChange={onChange} />);
    expect(screen.getByLabelText("M")).toHaveAttribute("aria-checked", "false");

    await user.click(screen.getByText("M"));
    expect(screen.getByLabelText("M")).toHaveAttribute("aria-checked", "true");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ]);

    await user.click(screen.getByText("W"));
    expect(screen.getByLabelText("W")).toHaveAttribute("aria-checked", "true");
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith([
      false,
      true,
      false,
      true,
      false,
      false,
      false,
    ]);

    await user.click(screen.getByText("W"));
    expect(screen.getByLabelText("W")).toHaveAttribute("aria-checked", "false");
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith([
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ]);
  });
});
