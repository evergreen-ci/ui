import { render, screen } from "@evg-ui/lib/test_utils";
import WaterfallSkeleton from ".";

describe("WaterfallSkeleton", () => {
  it("renders the default loading grid", () => {
    render(<WaterfallSkeleton />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getAllByText("Loading waterfall data")).toHaveLength(96);
  });

  it("renders the requested number of cells", () => {
    render(<WaterfallSkeleton numCols={2} numRows={3} />);

    expect(screen.getAllByText("Loading waterfall data")).toHaveLength(8);
  });
});
