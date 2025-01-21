import { act, renderHook } from "@evg-ui/lib/test_utils";
import { useDimensions } from "hooks/useDimensions";

describe("useDimensions", () => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  let listener;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  let disconnectSpy;

  beforeEach(() => {
    // @ts-ignore next-line
    window.requestAnimationFrame = vi.fn((cb) => cb());
    disconnectSpy = vi.fn();
    window.ResizeObserver = vi.fn().mockImplementation((l) => {
      listener = l;
      return {
        observe: () => {},
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        disconnect: disconnectSpy,
        unobserve: () => {},
      };
    });
  });

  it("validate default value", () => {
    const { result } = renderHook(() => useDimensions({ current: null }));
    expect(result.current).toMatchObject({
      width: 0,
      height: 0,
    });
  });

  it("synchronously sets up ResizeObserver listener", () => {
    renderHook(() => useDimensions({ current: null }));
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(typeof listener).toBe("function");
  });

  it("tracks DOM dimensions", () => {
    const { result } = renderHook(() =>
      useDimensions({ current: document.createElement("div") }),
    );

    act(() => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      listener([
        {
          target: {
            clientWidth: 200,
            clientHeight: 200,
          },
        },
      ]);
    });

    expect(result.current).toMatchObject({
      width: 200,
      height: 200,
    });
  });

  it("tracks multiple updates", () => {
    const { result } = renderHook(() =>
      useDimensions({ current: document.createElement("div") }),
    );

    act(() => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      listener([
        {
          target: {
            clientWidth: 200,
            clientHeight: 200,
          },
        },
      ]);
    });

    expect(result.current).toMatchObject({
      width: 200,
      height: 200,
    });

    act(() => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      listener([
        {
          target: {
            clientWidth: 100,
            clientHeight: 100,
          },
        },
      ]);
    });

    expect(result.current).toMatchObject({
      width: 100,
      height: 100,
    });
  });

  it("calls .disconnect() on ResizeObserver when component unmounts", () => {
    const { unmount } = renderHook(() =>
      useDimensions({ current: document.createElement("div") }),
    );

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(disconnectSpy).toHaveBeenCalledTimes(0);

    unmount();

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });
});
