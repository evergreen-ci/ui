import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { DateFilter } from ".";

describe("date filter", () => {
  it("calls onChange when date is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateFilter onChange={onChange} value="2023-12-25" />);

    const calendarButton = screen.getByRole("button", {
      name: "Open calendar menu",
    });
    await user.click(calendarButton);

    const popover = screen.getByRole("listbox");
    expect(popover).toBeInTheDocument();

    const cell = screen.getByRole("gridcell", {
      name: "Thursday, December 28, 2023",
    });
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveAttribute("aria-disabled", "false");
    await user.click(cell);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("renders value", () => {
    render(<DateFilter onChange={vi.fn()} value="2023-12-23" />);
    expect(screen.getByLabelText("year")).toHaveValue("2023");
    expect(screen.getByLabelText("month")).toHaveValue("12");
    expect(screen.getByLabelText("day")).toHaveValue("23");
  });

  it("only shows label if showLabel is specified", () => {
    const { rerender } = render(
      <DateFilter onChange={vi.fn()} value="2025-05-05" />,
    );
    expect(screen.queryByText("Go to Date")).not.toBeInTheDocument();

    rerender(<DateFilter onChange={vi.fn()} showLabel value="2025-05-05" />);
    expect(screen.getByText("Go to Date")).toBeVisible();
  });
});
