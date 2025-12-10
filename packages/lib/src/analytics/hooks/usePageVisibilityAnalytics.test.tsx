import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useAnalyticsRoot } from "./useAnalyticsRoot";
import { usePageVisibilityAnalytics } from "./usePageVisibilityAnalytics";

// Import after mocking

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
    renderHook(() =>
      usePageVisibilityAnalytics({
        identifier: "TestPage",
      }),
    );

    expect(mockSendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "System Event page visibility session started",
        "visibility.initial_state": "visible",
      }),
    );
  });

  it("should not track events when disabled", () => {
    renderHook(() =>
      usePageVisibilityAnalytics({
        identifier: "TestPage",
        enabled: false,
      }),
    );

    expect(mockSendEvent).not.toHaveBeenCalled();
  });

  it("should track visibility change from visible to hidden", () => {
    vi.useFakeTimers();

    renderHook(() =>
      usePageVisibilityAnalytics({
        identifier: "TestPage",
        minDuration: 100,
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
        name: "System Event page became hidden",
        "visibility.duration_visible_ms": expect.any(Number),
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
        identifier: "TestPage",
        minDuration: 100,
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
        name: "System Event page became visible",
        "visibility.duration_hidden_ms": expect.any(Number),
      }),
    );
  });

  it("should not track rapid visibility changes below minimum duration", () => {
    vi.useFakeTimers();

    renderHook(() =>
      usePageVisibilityAnalytics({
        identifier: "TestPage",
        minDuration: 1000,
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
        identifier: "TestPage",
        trackSession: true,
        minDuration: 100,
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
        name: "System Event page visibility session ended",
        "visibility.total_visible_ms": expect.any(Number),
        "visibility.total_hidden_ms": expect.any(Number),
        "visibility.state_changes": 2,
      }),
    );
  });

  it("should not track session end when trackSession is false", () => {
    const { unmount } = renderHook(() =>
      usePageVisibilityAnalytics({
        identifier: "TestPage",
        trackSession: false,
      }),
    );

    mockSendEvent.mockClear();
    unmount();

    expect(mockSendEvent).not.toHaveBeenCalled();
  });

  it("should pass custom attributes to analytics events", () => {
    renderHook(() =>
      usePageVisibilityAnalytics({
        identifier: "TestPage",
        attributes: {
          "page.section": "dashboard",
          "user.role": "admin",
        },
      }),
    );

    expect(useAnalyticsRoot).toHaveBeenCalledWith("TestPage", {
      "page.section": "dashboard",
      "user.role": "admin",
    });
  });

  it("should return current visibility state", () => {
    const { result } = renderHook(() =>
      usePageVisibilityAnalytics({
        identifier: "TestPage",
      }),
    );

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
      usePageVisibilityAnalytics({
        identifier: "TestPage",
      }),
    );

    expect(result2.current.isVisible).toBe(false);
  });
});
