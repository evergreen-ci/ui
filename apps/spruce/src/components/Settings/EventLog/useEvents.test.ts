import { renderHook } from "@evg-ui/lib/test_utils";
import { useEvents } from "./useEvents";

describe("useEvents", () => {
  const limit = 15;

  it("should return allEventsFetched as false when lastFetchedCount is undefined", () => {
    const { result } = renderHook(() => useEvents(limit, undefined, false));
    expect(result.current.allEventsFetched).toBe(false);
  });

  it("should set allEventsFetched to true when lastFetchedCount < limit", () => {
    const { result } = renderHook(() => useEvents(limit, 5, false));
    expect(result.current.allEventsFetched).toBe(true);
  });

  it("should set allEventsFetched to false when loading", () => {
    const { result } = renderHook(() => useEvents(limit, 5, true));
    expect(result.current.allEventsFetched).toBe(false);
  });

  it("should keep allEventsFetched as false when lastFetchedCount >= limit", () => {
    const { result } = renderHook(() => useEvents(limit, 15, false));
    expect(result.current.allEventsFetched).toBe(false);
  });

  it("should set allEventsFetched to true when lastFetchedCount is 0", () => {
    const { result } = renderHook(() => useEvents(limit, 0, false));
    expect(result.current.allEventsFetched).toBe(true);
  });

  it("should update when lastFetchedCount changes", () => {
    const { rerender, result } = renderHook(
      ({ lastFetchedCount }) => useEvents(limit, lastFetchedCount, false),
      { initialProps: { lastFetchedCount: 15 } },
    );
    expect(result.current.allEventsFetched).toBe(false);

    rerender({ lastFetchedCount: 5 });
    expect(result.current.allEventsFetched).toBe(true);
  });
});
