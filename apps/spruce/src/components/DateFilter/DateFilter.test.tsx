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
    const firstRow = screen.getAllByRole("row")[0];
    const firstCell = within(firstRow).getAllByRole("gridcell")[0];
    expect(
      within(firstCell).getByRole("button", {
        name: "Monday, November 27, 2023",
      }),
    ).toBeInTheDocument();
  });

  it("keeps the typed month and day while the year is incomplete", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateFilter onChange={onChange} value="" />);

    await user.click(getSegment("month"));
    await user.keyboard("1225202");

    expect(getSegment("month")).toHaveTextContent("12");
    expect(getSegment("day")).toHaveTextContent("25");
    expect(getSegment("year")).toHaveTextContent("202");
    expect(onChange).not.toHaveBeenCalled();

    await user.keyboard("2");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("2022-12-25");
  });

  it("only calls onChange once the typed year is complete", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateFilter onChange={onChange} value="2023-12-25" />);

    await user.click(getSegment("year"));
    await user.keyboard("2022");

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("2022-12-25");
  });

  it("does not call onChange for a typed date after today", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateFilter onChange={onChange} value="2023-12-25" />);

    await user.click(getSegment("year"));
    await user.keyboard("2099");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders value", () => {
    render(<DateFilter onChange={vi.fn()} value="2023-12-23" />);
    expect(getSegment("year")).toHaveTextContent("2023");
    expect(getSegment("month")).toHaveTextContent("12");
    expect(getSegment("day")).toHaveTextContent("23");
  });

  it("updates the field when value changes from outside", () => {
    const { rerender } = render(
      <DateFilter onChange={vi.fn()} value="2023-12-23" />,
    );
    rerender(<DateFilter onChange={vi.fn()} value="2024-01-05" />);
    expect(getSegment("year")).toHaveTextContent("2024");
    expect(getSegment("day")).toHaveTextContent("5");

    rerender(<DateFilter onChange={vi.fn()} value="" />);
    expect(getSegment("year")).not.toHaveAttribute("aria-valuenow");
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
