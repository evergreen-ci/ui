import {
  renderWithRouterMatch as render,
  fireEvent,
  screen,
} from "@evg-ui/lib/test_utils";
import WaterfallErrorBoundary from ".";

// Mock the utility function
vi.mock("@evg-ui/lib/utils/errorReporting", () => ({
  reportError: vi.fn(() => ({ warning: vi.fn() })),
}));

describe("WaterfallErrorBoundary", () => {
  it("renders child component without error", () => {
    render(
      <WaterfallErrorBoundary projectIdentifier="project1">
        <div>Child Component</div>
      </WaterfallErrorBoundary>,
    );
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("displays error message when error boundary catches an error", () => {
    const ErrorComponent = () => {
      throw new Error("Test error");
    };

    render(
      <WaterfallErrorBoundary projectIdentifier="project1">
        <ErrorComponent />
      </WaterfallErrorBoundary>,
    );

    expect(screen.getByText("Oops! Something went wrong.")).toBeInTheDocument();
    expect(screen.getByText(/Error: Test error/i)).toBeInTheDocument();
  });

  it("handles return to waterfall button click", () => {
    const ErrorComponent = () => {
      throw new Error("Test error");
    };

    render(
      <WaterfallErrorBoundary projectIdentifier="project1">
        <ErrorComponent />
      </WaterfallErrorBoundary>,
    );

    const resetButton = screen.getByRole("button", {
      name: /Return to waterfall/i,
    });
    fireEvent.click(resetButton);

    expect(
      screen.queryByText("Oops! Something went wrong."),
    ).not.toBeInTheDocument();
  });

  it("resets error boundary state when the project identifier changes", () => {
    const ErrorComponent = () => {
      throw new Error("Test error");
    };

    const { rerender } = render(
      <WaterfallErrorBoundary projectIdentifier="project1">
        <ErrorComponent />
      </WaterfallErrorBoundary>,
    );

    rerender(
      <WaterfallErrorBoundary projectIdentifier="project2">
        <div>Child Component</div>
      </WaterfallErrorBoundary>,
    );

    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });
});
