import { captureException } from "@sentry/react";
import { render, screen } from "test_utils";
import ErrorBoundary from ".";

vi.mock("@sentry/react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // @ts-expect-error Not necessary to mock the entire object for the test.
    ...actual,
    captureException: vi.fn(),
  };
});

describe("default error boundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the passed in component", () => {
    const TestComponent = () => <div>Hello</div>;
    const TestErrorBoundary = () => (
      <ErrorBoundary homeURL="/">
        <TestComponent />
      </ErrorBoundary>
    );
    render(<TestErrorBoundary />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("should display the fallback when an error occurs", () => {
    const err = new Error("Test error");

    const TestComponent = () => {
      throw err;
    };
    const TestErrorBoundary = () => (
      <ErrorBoundary homeURL="/">
        <TestComponent />
      </ErrorBoundary>
    );
    render(<TestErrorBoundary />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith({
      error: err,
      errorInfo: expect.objectContaining({
        componentStack: expect.any(String),
      }),
    });
    expect(vi.mocked(captureException)).not.toHaveBeenCalled();
  });
});
