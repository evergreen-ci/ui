import { renderHook } from "@evg-ui/lib/test_utils";
import { useEvents } from "./useEvents";

describe("useEvents", () => {
  const limit = 15;

  it("should return allEventsFetched as false when count is undefined", () => {
    const { result } = renderHook(() => useEvents(limit, undefined, 0));
    expect(result.current.allEventsFetched).toBe(false);
  });

  it("should set allEventsFetched to true when count - previousCount < limit", () => {
    // Simulate fetchMore that returns fewer than limit events
    const { result } = renderHook(() => useEvents(limit, 20, 15)); // Only 5 new events
    expect(result.current.allEventsFetched).toBe(true);
  });

  it("should keep allEventsFetched as false when count - previousCount >= limit", () => {
    // Simulate fetchMore that returns exactly limit events
    const { result } = renderHook(() => useEvents(limit, 30, 15)); // 15 new events
    expect(result.current.allEventsFetched).toBe(false);
  });

  it("should set allEventsFetched to true on initial load when count < limit", () => {
    // Initial load returns fewer than limit events
    const { result } = renderHook(() => useEvents(limit, 10, 0)); // Only 10 events total
    expect(result.current.allEventsFetched).toBe(true);
  });

  it("should keep allEventsFetched as false on initial load when count >= limit", () => {
    // Initial load returns exactly limit events
    const { result } = renderHook(() => useEvents(limit, 15, 0)); // 15 events
    expect(result.current.allEventsFetched).toBe(false);
  });

  it("should handle edge case when count equals previousCount (no new events)", () => {
    const { result } = renderHook(() => useEvents(limit, 15, 15)); // 0 new events
    expect(result.current.allEventsFetched).toBe(true);
  });

  it("should update when count changes", () => {
    // Start with enough events that we haven't fetched all
    const { rerender, result } = renderHook(
      ({ count, previousCount }) => useEvents(limit, count, previousCount),
      { initialProps: { count: 15, previousCount: 0 } },
    );
    expect(result.current.allEventsFetched).toBe(false);

    // Rerender with a fetchMore that returns fewer than limit
    rerender({ count: 20, previousCount: 15 }); // Only 5 new events
    expect(result.current.allEventsFetched).toBe(true);
  });

  it("should derive allEventsFetched from current inputs", () => {
    const { rerender, result } = renderHook(
      ({ count, previousCount }) => useEvents(limit, count, previousCount),
      { initialProps: { count: 20, previousCount: 15 } }, // 5 new events, all fetched
    );
    expect(result.current.allEventsFetched).toBe(true);

    // Value is derived from inputs - if inputs change, result changes
    rerender({ count: 50, previousCount: 20 }); // 30 new events
    expect(result.current.allEventsFetched).toBe(false);
  });
});
