import { isInitialized } from "@sentry/core";
import { Mock } from "vitest";
import { render, screen } from "test_utils";
import { dynamicallyLoadedModuleErrorMessage } from "./utils";
import ErrorBoundary from ".";

vi.mock("@sentry/react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // @ts-expect-error Not necessary to mock the entire object for the test.
    ...actual,
    captureException: vi.fn(),
  };
});
vi.mock("@sentry/core", () => ({
  isInitialized: vi.fn(),
}));
describe("Error boundary", () => {
  describe("When sentry is not initialized", () => {
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
      expect(screen.getByDataCy("error-fallback")).toBeInTheDocument();
    });
  });
  describe("When sentry is initialized", () => {
    beforeEach(() => {
      (isInitialized as unknown as Mock).mockReturnValue(true);
      vi.spyOn(console, "error").mockImplementation(() => {});
      Object.defineProperty(window, "location", {
        value: {
          ...window.location,
          reload: vi.fn(),
        },
        writable: true,
      });
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

    it("should display the fallback when a regular error occurs", () => {
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

      expect(screen.getByDataCy("error-fallback")).toBeInTheDocument();
    });
    it("should refresh the page when an old bundle error occurs", () => {
      const err = new Error(dynamicallyLoadedModuleErrorMessage);

      vi.spyOn(window.location, "reload").mockImplementation(() => {});

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
      expect(screen.getByDataCy("error-fallback")).toBeInTheDocument();
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
