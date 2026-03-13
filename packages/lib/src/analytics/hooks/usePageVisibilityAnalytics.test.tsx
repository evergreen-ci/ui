import { act, render, renderHook } from "@testing-library/react";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router-dom";
import { useAnalyticsRoot } from "./useAnalyticsRoot";
import { usePageVisibilityAnalytics } from "./usePageVisibilityAnalytics";

// Mock the analytics root hook
vi.mock("./useAnalyticsRoot", () => ({
  useAnalyticsRoot: vi.fn(() => ({
    sendEvent: vi.fn(),
  })),
}));

describe("usePageVisibilityAnalytics", () => {
  let mockSendEvent: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSendEvent = vi.fn();
    (useAnalyticsRoot as ReturnType<typeof vi.fn>).mockReturnValue({
      sendEvent: mockSendEvent,
    });

    // Reset document visibility state
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should track session start on mount", () => {
    renderHook(() => usePageVisibilityAnalytics({}));

    expect(mockSendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "System Event session started",
        "visibility.initial_state": "visible",
      }),
    );
  });

  it("should not track events when disabled", () => {
    renderHook(() =>
      usePageVisibilityAnalytics({
        enabled: false,
      }),
    );

    expect(mockSendEvent).not.toHaveBeenCalled();
  });

  it("should track visibility change from visible to hidden", () => {
    vi.useFakeTimers();

    renderHook(() =>
      usePageVisibilityAnalytics({
        minDurationMs: 100,
      }),
    );

    // Clear the initial session start event
    mockSendEvent.mockClear();

    // Wait for minimum duration
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Change visibility to hidden
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(mockSendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "System Event page hidden",
        "visibility.duration_ms": expect.any(Number),
      }),
    );
  });

  it("should track visibility change from hidden to visible", () => {
    vi.useFakeTimers();

    // Start with hidden state
    Object.defineProperty(document, "visibilityState", {
      value: "hidden",
      configurable: true,
    });

    renderHook(() =>
      usePageVisibilityAnalytics({
        minDurationMs: 100,
      }),
    );

    // Clear the initial session start event
    mockSendEvent.mockClear();

    // Wait for minimum duration
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Change visibility to visible
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(mockSendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "System Event page visible",
        "visibility.duration_ms": expect.any(Number),
      }),
    );
  });

  it("should not track rapid visibility changes below minimum duration", () => {
    vi.useFakeTimers();

    renderHook(() =>
      usePageVisibilityAnalytics({
        minDurationMs: 1000,
      }),
    );

    // Clear the initial session start event
    mockSendEvent.mockClear();

    // Change visibility quickly (below minimum duration)
    act(() => {
      vi.advanceTimersByTime(500); // Less than 1000ms minimum
    });

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(mockSendEvent).not.toHaveBeenCalled();
  });

  it("should track session end on unmount with statistics", () => {
    vi.useFakeTimers();

    const { unmount } = renderHook(() =>
      usePageVisibilityAnalytics({
        minDurationMs: 100,
      }),
    );

    // Simulate some visibility changes
    act(() => {
      vi.advanceTimersByTime(200);
    });

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    mockSendEvent.mockClear();

    // Unmount to trigger session end
    unmount();

    expect(mockSendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "System Event session ended",
        "visibility.total_visible_ms": expect.any(Number),
        "visibility.total_hidden_ms": expect.any(Number),
        "visibility.visibility_changes": 2,
      }),
    );
  });

  it("should track session end even without visibility changes", () => {
    vi.useFakeTimers();

    const { unmount } = renderHook(() => usePageVisibilityAnalytics({}));

    mockSendEvent.mockClear();

    // Advance time without any visibility changes
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    unmount();

    // Session end should still be sent even with 0 state changes
    expect(mockSendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "System Event session ended",
        "visibility.visibility_changes": 0,
      }),
    );
  });

  it("should pass custom attributes to analytics events", () => {
    renderHook(() =>
      usePageVisibilityAnalytics({
        attributes: {
          "page.section": "dashboard",
          "user.role": "admin",
        },
      }),
    );

    expect(useAnalyticsRoot).toHaveBeenCalledWith("PageVisibility", {
      "page.section": "dashboard",
      "user.role": "admin",
    });
  });

  it("should return current visibility state", () => {
    const { result } = renderHook(() => usePageVisibilityAnalytics({}));

    expect(result.current.isVisible).toBe(true);

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
    });

    // Note: The hook returns document.visibilityState === "visible" at render time
    // To properly test dynamic updates, we'd need to re-render
    const { result: result2 } = renderHook(() =>
      usePageVisibilityAnalytics({}),
    );

    expect(result2.current.isVisible).toBe(false);
  });

  it("should not fire events on route navigation", () => {
    vi.useFakeTimers();

    const NavigationTestComponent: React.FC = () => {
      usePageVisibilityAnalytics({});
      return <Outlet />;
    };

    const router = createMemoryRouter(
      [
        {
          element: <NavigationTestComponent />,
          children: [
            { path: "/", element: <div>Home</div> },
            { path: "/other", element: <div>Other</div> },
          ],
        },
      ],
      { initialEntries: ["/"] },
    );

    render(<RouterProvider router={router} />);

    expect(mockSendEvent).toHaveBeenCalledTimes(1);
    expect(mockSendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "System Event session started",
      }),
    );

    mockSendEvent.mockClear();

    // Navigate to a new route
    act(() => {
      router.navigate("/other");
    });

    // No session ended/started events should fire on navigation
    expect(mockSendEvent).not.toHaveBeenCalled();

    // Verify visibility tracking still works after navigation
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(mockSendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "System Event page hidden",
        "visibility.duration_ms": expect.any(Number),
      }),
    );
  });

  it("should only send one session started event across multiple navigations", () => {
    const NavigationTestComponent: React.FC = () => {
      usePageVisibilityAnalytics({});
      return <Outlet />;
    };

    const router = createMemoryRouter(
      [
        {
          element: <NavigationTestComponent />,
          children: [
            { path: "/", element: <div>Home</div> },
            { path: "/page-a", element: <div>Page A</div> },
            { path: "/page-b", element: <div>Page B</div> },
          ],
        },
      ],
      { initialEntries: ["/"] },
    );

    render(<RouterProvider router={router} />);

    act(() => {
      router.navigate("/page-a");
    });

    act(() => {
      router.navigate("/page-b");
    });

    act(() => {
      router.navigate("/");
    });

    const sessionStartedCalls = mockSendEvent.mock.calls.filter(
      (call: unknown[]) =>
        (call[0] as { name: string }).name === "System Event session started",
    );
    expect(sessionStartedCalls).toHaveLength(1);

    const sessionEndedCalls = mockSendEvent.mock.calls.filter(
      (call: unknown[]) =>
        (call[0] as { name: string }).name === "System Event session ended",
    );
    expect(sessionEndedCalls).toHaveLength(0);
  });
});
