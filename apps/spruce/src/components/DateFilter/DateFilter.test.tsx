import { render, screen, userEvent, within } from "@evg-ui/lib/test_utils";
import { DateFilter } from ".";

const getSegment = (name: string) =>
  screen.getByRole("spinbutton", { name: new RegExp(`^${name},`) });

describe("date filter", () => {
  it("calls onChange when date is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateFilter onChange={onChange} value="2023-12-25" />);

    await user.click(screen.getByRole("button", { name: "Open calendar" }));
    expect(screen.getByRole("grid")).toBeInTheDocument();

    const cell = screen.getByRole("button", {
      name: "Thursday, December 28, 2023",
    });
    await user.click(cell);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("2023-12-28");
  });

  it("starts the calendar week on Monday", async () => {
    const user = userEvent.setup();
    render(<DateFilter onChange={vi.fn()} value="2023-12-25" />);

    await user.click(screen.getByRole("button", { name: "Open calendar" }));
    const [firstRow] = screen.getAllByRole("row");
    const firstCell = within(firstRow).getAllByRole("gridcell")[0];
    expect(firstCell).toHaveTextContent("27");
  });

  it("renders value", () => {
    render(<DateFilter onChange={vi.fn()} value="2023-12-23" />);
    expect(getSegment("year")).toHaveTextContent("2023");
    expect(getSegment("month")).toHaveTextContent("12");
    expect(getSegment("day")).toHaveTextContent("23");
  });

  it("renders an empty field when value is empty", () => {
    render(<DateFilter onChange={vi.fn()} value="" />);
    expect(getSegment("year")).not.toHaveAttribute("aria-valuenow");
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
