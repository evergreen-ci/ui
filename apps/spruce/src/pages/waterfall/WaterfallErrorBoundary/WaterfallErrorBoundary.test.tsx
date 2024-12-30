import React from "react";
import {
  renderWithRouterMatch as render,
  fireEvent,
  screen,
} from "@evg-ui/lib/test_utils";
import "@testing-library/jest-dom";
import WaterfallErrorBoundary from ".";

// Mock the utility function
vi.mock("utils/errorReporting", () => ({
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

  it("handles reset page button click", () => {
    const ErrorComponent = () => {
      throw new Error("Test error");
    };

    render(
      <WaterfallErrorBoundary projectIdentifier="project1">
        <ErrorComponent />
      </WaterfallErrorBoundary>,
    );

    const resetButton = screen.getByRole("button", { name: /Reset Page/i });
    fireEvent.click(resetButton);

    expect(
      screen.queryByText("Oops! Something went wrong."),
    ).not.toBeInTheDocument();
  });
});
