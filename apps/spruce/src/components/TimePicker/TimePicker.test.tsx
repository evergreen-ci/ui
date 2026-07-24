import { useState } from "react";
import { DateType } from "@leafygreen-ui/date-utils";
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
    // scrollIntoView isn't implemented in JSDom and must be mocked.
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
    const hourInput = screen.getByDataTestId("hour-input");
    expect(hourInput).toHaveValue("12");
    const minuteInput = screen.getByDataTestId("minute-input");
    expect(minuteInput).toHaveValue("33");
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
    await waitFor(() => {
      expect(screen.getByDataTestId("time-picker-options")).toBeVisible();
    });
    await user.click(iconButton);
    await waitForElementToBeRemoved(
      screen.queryByDataTestId("time-picker-options"),
    );
  });

  const CustomRender = ({
    onDateChange,
  }: {
    onDateChange: (d: DateType) => void;
  }) => {
    const [date, setDate] = useState(new Date("2025-01-01T12:33:00Z"));
    const handleChange = (d: DateType) => {
      setDate(d as Date);
      onDateChange(d);
    };
    return (
      <LeafyGreenTimePicker
        data-testid="leafygreen-time-picker"
        disabled={false}
        label=""
        onDateChange={handleChange}
        value={date}
      />
    );
  };

  it("can select time via popover options", async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();

    const onScroll = vi.fn();
    Element.prototype.scrollIntoView = onScroll;

    render(<CustomRender onDateChange={onDateChange} />);

    const iconButton = screen.getByRole("button", { name: "Clock Icon" });
    await user.click(iconButton);
    const menuOptions = screen.getByDataTestId("time-picker-options");
    await waitFor(() => {
      expect(menuOptions).toBeVisible();
    });

    // Wait for scroll to be called when the menu opens.
    await waitFor(() => {
      expect(onScroll).toHaveBeenCalledTimes(2);
    });

    const hourOptions = screen.getByDataTestId("hour-options");
    await user.click(within(hourOptions).getByText("04"));
    await waitFor(() => {
      expect(onScroll).toHaveBeenCalled();
    });
    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(onDateChange).toHaveBeenCalledWith(
      new Date("2025-01-01T04:33:00.000Z"),
    );

    const minuteOptions = screen.getByDataTestId("minute-options");
    await user.click(within(minuteOptions).getByText("40"));
    await waitFor(() => {
      expect(onScroll).toHaveBeenCalled();
    });
    expect(onDateChange).toHaveBeenCalledTimes(2);
    expect(onDateChange).toHaveBeenCalledWith(
      new Date("2025-01-01T04:40:00.000Z"),
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
    const hourInput = screen.getByDataTestId("hour-input");
    expect(hourInput).toBeDisabled();
    const minuteInput = screen.getByDataTestId("minute-input");
    expect(minuteInput).toBeDisabled();
  });
});
