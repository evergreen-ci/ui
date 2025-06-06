import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@evg-ui/lib/test_utils";
import LeafyGreenTimePicker from ".";

describe("time picker", () => {
  beforeEach(() => {
    // scrollTo isn't implemented in JSDom and must be mocked.
    Element.prototype.scrollIntoView = () => {};
  });

  it("renders a timepicker with default time selected", () => {
    render(
      <LeafyGreenTimePicker
        disabled={false}
        label=""
        onDateChange={vi.fn()}
        value={new Date("2025-01-01T12:33:00Z")}
      />,
    );
    const hourInput = screen.getByDataCy("hour-input");
    expect(hourInput).toHaveValue("12");
    const minuteInput = screen.getByDataCy("minute-input");
    expect(minuteInput).toHaveValue("33");
  });

  it("can select time via popover options", async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();

    const onScroll = vi.fn();
    Element.prototype.scrollIntoView = onScroll;

    render(
      <LeafyGreenTimePicker
        data-cy="leafygreen-time-picker"
        disabled={false}
        label=""
        onDateChange={onDateChange}
        value={new Date("2025-01-01T12:33:00Z")}
      />,
    );

    const iconButton = screen.getByRole("button", { name: "Clock Icon" });
    await user.click(iconButton);
    const menuOptions = screen.getByDataCy("time-picker-options");
    expect(menuOptions).toBeVisible();

    // Wait for scroll to be called when the menu opens.
    await waitFor(() => {
      expect(onScroll).toHaveBeenCalledTimes(2);
    });

    const hourOptions = screen.getByDataCy("hour-options");
    await user.click(within(hourOptions).getByText("04"));
    expect(onScroll).toHaveBeenCalledTimes(3);
    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(onDateChange).toHaveBeenCalledWith(
      new Date("2025-01-01T04:33:00.000Z"),
    );

    const minuteOptions = screen.getByDataCy("minute-options");
    await user.click(within(minuteOptions).getByText("40"));
    expect(onScroll).toHaveBeenCalledTimes(4);
    expect(onDateChange).toHaveBeenCalledTimes(2);
    expect(onDateChange).toHaveBeenCalledWith(
      new Date("2025-01-01T04:40:00.000Z"),
    );
  });

  it("can close and open menu via icon button", async () => {
    const user = userEvent.setup();
    render(
      <LeafyGreenTimePicker
        disabled={false}
        label=""
        onDateChange={vi.fn()}
        value={new Date("2025-01-01T12:33:00Z")}
      />,
    );
    const iconButton = screen.getByRole("button", { name: "Clock Icon" });
    await user.click(iconButton);
    expect(screen.getByDataCy("time-picker-options")).toBeVisible();
    await user.click(iconButton);
    await waitForElementToBeRemoved(
      screen.queryByDataCy("time-picker-options"),
    );
  });

  it("disables time picker", () => {
    render(
      <LeafyGreenTimePicker
        disabled
        label=""
        onDateChange={vi.fn()}
        value={new Date("2025-01-01T12:33:00Z")}
      />,
    );
    const hourInput = screen.getByDataCy("hour-input");
    expect(hourInput).toBeDisabled();
    const minuteInput = screen.getByDataCy("minute-input");
    expect(minuteInput).toBeDisabled();
  });
});
