import {
  act,
  render,
  renderComponentWithHook,
  renderHook,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { RenderFakeToastContext } from "./__mocks__";
import { TOAST_TIMEOUT } from "./constants";
import { ToastProvider, useToastContext } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <div>{children}</div>
  </ToastProvider>
);

describe("toast", () => {
  const closeIconLabel = "Close Message";

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("should error when rendered outside of ToastProvider context", () => {
    // This test intentionally throws an error, so we need to mock the error object to prevent it
    // from flooding the test runner.
    const errorObject = console.error;
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { Component } = renderComponentWithHook(useToastContext, <div />);
    expect(() => render(<Component />)).toThrow(
      "useToastContext must be used within a ToastProvider",
    );
    console.error = errorObject;
  });

  it("should not display a toast by default", () => {
    const { Component } = renderComponentWithHook(useToastContext, <div />);
    render(<Component />, { wrapper });
    expect(screen.queryByDataCy("toast")).toBeNull();
  });

  it("should be able to set a custom title for a toast", async () => {
    const { Component, hook } = renderComponentWithHook(
      useToastContext,
      <div />,
    );
    render(<Component />, {
      wrapper,
    });
    act(() => {
      hook.current.info("test string", true, { title: "Custom Title" });
    });
    expect(screen.queryByText("Something Happened!")).not.toBeInTheDocument();
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("test string")).toBeInTheDocument();
  });

  describe("displays a toast which corresponds to the variant dispatched", () => {
    it("success", async () => {
      const { Component, hook } = renderComponentWithHook(
        useToastContext,
        <div />,
      );
      render(<Component />, {
        wrapper,
      });
      act(() => {
        hook.current.success("test string");
      });
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.getByText("Success!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });

    it("error", async () => {
      const { Component, hook } = renderComponentWithHook(
        useToastContext,
        <div />,
      );
      render(<Component />, {
        wrapper,
      });
      act(() => {
        hook.current.error("test string");
      });
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.getByText("Error!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });

    it("warning", async () => {
      const { Component, hook } = renderComponentWithHook(
        useToastContext,
        <div />,
      );
      render(<Component />, {
        wrapper,
      });
      act(() => {
        hook.current.warning("test string");
      });
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.getByText("Warning!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });

    it("info", async () => {
      const { Component, hook } = renderComponentWithHook(
        useToastContext,
        <div />,
      );
      render(<Component />, {
        wrapper,
      });
      act(() => {
        hook.current.info("test string");
      });
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.getByText("Something Happened!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });

    it("progress", async () => {
      const { Component, hook } = renderComponentWithHook(
        useToastContext,
        <div />,
      );
      render(<Component />, {
        wrapper,
      });
      act(() => {
        hook.current.progress("test string", 0.8);
      });
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "80");
    });
  });

  describe("closing the toast", () => {
    it("should be able to close a toast by clicking the X button by default", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { Component, hook } = renderComponentWithHook(
        useToastContext,
        <div />,
      );
      render(<Component />, {
        wrapper,
      });
      act(() => {
        hook.current.info("test string");
      });

      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      await user.click(screen.getByLabelText(closeIconLabel));
      await waitFor(() => {
        expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
      });
    });

    it("should not be able to close the toast when closable is false", async () => {
      const { Component, hook } = renderComponentWithHook(
        useToastContext,
        <div />,
      );
      render(<Component />, {
        wrapper,
      });
      act(() => {
        hook.current.info("test string", false);
      });
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.queryByLabelText(closeIconLabel)).toBeNull();
    });

    it("should trigger a callback function onClose", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onClose = vi.fn();
      const { Component, hook } = renderComponentWithHook(
        useToastContext,
        <div />,
      );
      render(<Component />, {
        wrapper,
      });
      act(() => {
        hook.current.info("test string", true, { onClose });
      });

      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      await user.click(screen.getByLabelText(closeIconLabel));
      await waitFor(() => {
        expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should close on its own after a timeout has completed", async () => {
      const { Component, hook } = renderComponentWithHook(
        useToastContext,
        <div />,
      );
      render(<Component />, {
        wrapper,
      });
      act(() => {
        hook.current.info("test string");
      });
      expect(screen.getByDataCy("toast")).toBeInTheDocument();

      // Advance timer so that the timeout is triggered.
      act(() => {
        vi.advanceTimersByTime(TOAST_TIMEOUT);
      });
      await waitFor(() => {
        expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
      });
    });
  });
});

describe("mocked toast", () => {
  it("should be able to mock the toast in a component test", async () => {
    const user = userEvent.setup();
    const ToastComponent: React.FC = () => {
      const dispatchToast = useToastContext();
      return (
        <button onClick={() => dispatchToast.success("test")} type="button">
          Click Me
        </button>
      );
    };

    const {
      Component,
      dispatchToast,
      useToastContext: useToastContextSpied,
    } = RenderFakeToastContext(<ToastComponent />);

    render(<Component />);
    await user.click(screen.getByText("Click Me"));
    expect(useToastContextSpied).toHaveBeenCalledTimes(1);
    expect(dispatchToast.success).toHaveBeenCalledWith("test");
  });

  it("should be able to mock the toast in a hook test", () => {
    const useUpdateToastTest = () => {
      const dispatchToast = useToastContext();
      dispatchToast.success("test");
    };

    const { dispatchToast, useToastContext: useToastContextSpied } =
      RenderFakeToastContext();
    renderHook(() => useUpdateToastTest());
    expect(useToastContextSpied).toHaveBeenCalledTimes(1);
    expect(dispatchToast.success).toHaveBeenCalledWith("test");
  });
});
