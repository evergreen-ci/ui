import { renderHook, act } from "@evg-ui/lib/test_utils";
import { useResize } from ".";

describe("useResize", () => {
  const dispatchResizeEvent = () => {
    act(() => {
      window.dispatchEvent(new window.Event("resize"));
    });
  };

  it("should return true while window is resizing", () => {
    const { result } = renderHook(() => useResize());
    expect(result.current).toBe(false);

    dispatchResizeEvent();
    expect(result.current).toBe(true);
  });

  it("should call onResize callback if it is provided", () => {
    const onResize = vi.fn();
    const { result } = renderHook(() => useResize({ onResize }));
    expect(result.current).toBe(false);

    dispatchResizeEvent();
    expect(result.current).toBe(true);
    expect(onResize).toHaveBeenCalledTimes(1);
  });

  it("should return false when window is done resizing", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useResize());
    expect(result.current).toBe(false);

    dispatchResizeEvent();
    expect(result.current).toBe(true);

    // Advance timer so that the timeout is triggered.
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(false);
    vi.useRealTimers();
  });
});
