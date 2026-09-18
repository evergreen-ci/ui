import { render, screen } from "@evg-ui/lib/test_utils";
import WaterfallSkeleton from ".";

describe("WaterfallSkeleton", () => {
  it("renders the default loading grid", () => {
    render(<WaterfallSkeleton />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getAllByText("Build variant")).toHaveLength(1);
    expect(screen.getAllByText("Commit date and revision")).toHaveLength(5);
    expect(screen.getAllByText("Build variant name")).toHaveLength(15);
    expect(screen.getAllByText("Task status summary")).toHaveLength(75);
  });

  it("renders the requested number of cells", () => {
    render(<WaterfallSkeleton numCols={2} numRows={3} />);

    expect(screen.getAllByText("Build variant")).toHaveLength(1);
    expect(screen.getAllByText("Commit date and revision")).toHaveLength(1);
    expect(screen.getAllByText("Build variant name")).toHaveLength(3);
    expect(screen.getAllByText("Task status summary")).toHaveLength(3);
  });
});
