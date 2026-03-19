import { act, renderHook } from "test_utils";
import { useDebouncedCallback } from ".";

describe("useDebouncedCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not invoke the callback before the delay", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 400));

    act(() => {
      result.current("a");
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should invoke the callback after the delay", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 400));

    act(() => {
      result.current("a");
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("a");
  });

  it("should only invoke the callback once for rapid calls", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 400));

    act(() => {
      result.current("a");
      result.current("b");
      result.current("c");
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("c");
  });

  it("should cancel pending calls on unmount", () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, 400),
    );

    act(() => {
      result.current("test");
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should support manual cancellation via .cancel()", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 400));

    act(() => {
      result.current("test");
    });
    act(() => {
      result.current.cancel();
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should always use the latest callback", () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();
    const { rerender, result } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 400),
      { initialProps: { cb: firstCallback } },
    );

    act(() => {
      result.current("test");
    });
    rerender({ cb: secondCallback });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
    expect(secondCallback).toHaveBeenCalledWith("test");
  });
});
