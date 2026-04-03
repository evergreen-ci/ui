import { renderHook } from "@testing-library/react";
import { useAnalyticsRoot } from "./hooks";
import { sendEventTrace } from "./utils";

vi.mock("./utils", () => ({
  sendEventTrace: vi.fn(),
}));

describe("useAnalyticsRoot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a stable sendEvent function across re-renders", () => {
    const { rerender, result } = renderHook(() =>
      useAnalyticsRoot("TestComponent"),
    );

    const firstSendEvent = result.current.sendEvent;

    // Re-render the hook
    rerender();

    const secondSendEvent = result.current.sendEvent;

    // sendEvent should be the same reference
    expect(firstSendEvent).toBe(secondSendEvent);
  });

  it("should return a stable sendEvent function when attributes change", () => {
    const { rerender, result } = renderHook(
      ({ attrs }) => useAnalyticsRoot("TestComponent", attrs),
      {
        initialProps: { attrs: { "test.prop": "value1" } },
      },
    );

    const firstSendEvent = result.current.sendEvent;

    // Re-render with different attributes
    rerender({ attrs: { "test.prop": "value2" } });

    const secondSendEvent = result.current.sendEvent;

    // sendEvent should still be the same reference
    expect(firstSendEvent).toBe(secondSendEvent);
  });

  it("should return a stable sendEvent function when identifier changes", () => {
    const { rerender, result } = renderHook(({ id }) => useAnalyticsRoot(id), {
      initialProps: { id: "Component1" },
    });

    const firstSendEvent = result.current.sendEvent;

    // Re-render with different identifier
    rerender({ id: "Component2" });

    const secondSendEvent = result.current.sendEvent;

    // sendEvent should still be the same reference
    expect(firstSendEvent).toBe(secondSendEvent);
  });

  it("should call sendEventTrace with the correct identifier", () => {
    const { result } = renderHook(() =>
      useAnalyticsRoot("TestComponent", { "test.prop": "value" }),
    );

    result.current.sendEvent({ name: "Clicked button" });

    expect(sendEventTrace).toHaveBeenCalledWith(
      { name: "Clicked button" },
      {
        "analytics.identifier": "TestComponent",
        "test.prop": "value",
      },
    );
  });

  it("should use the latest attributes when sendEvent is called", () => {
    const { rerender, result } = renderHook(
      ({ attrs }) => useAnalyticsRoot("TestComponent", attrs),
      {
        initialProps: { attrs: { "test.prop": "value1" } },
      },
    );

    // Re-render with different attributes
    rerender({ attrs: { "test.prop": "value2" } });

    // Call sendEvent after the re-render
    result.current.sendEvent({ name: "Clicked button" });

    // Should use the latest attributes
    expect(sendEventTrace).toHaveBeenCalledWith(
      { name: "Clicked button" },
      {
        "analytics.identifier": "TestComponent",
        "test.prop": "value2",
      },
    );
  });

  it("should use the latest identifier when sendEvent is called", () => {
    const { rerender, result } = renderHook(({ id }) => useAnalyticsRoot(id), {
      initialProps: { id: "Component1" },
    });

    // Re-render with different identifier
    rerender({ id: "Component2" });

    // Call sendEvent after the re-render
    result.current.sendEvent({ name: "Clicked button" });

    // Should use the latest identifier
    expect(sendEventTrace).toHaveBeenCalledWith(
      { name: "Clicked button" },
      {
        "analytics.identifier": "Component2",
      },
    );
  });

  it("should not cause re-renders in components that depend on sendEvent", () => {
    let renderCount = 0;

    const { rerender } = renderHook(
      ({ attrs }) => {
        const { sendEvent } = useAnalyticsRoot("TestComponent", attrs);
        // Simulate a component that uses sendEvent in a dependency array
        renderCount += 1;
        return sendEvent;
      },
      {
        initialProps: { attrs: { "test.prop": "value1" } },
      },
    );

    expect(renderCount).toBe(1);

    // Re-render with different attributes
    rerender({ attrs: { "test.prop": "value2" } });

    // Should only render twice (initial + rerender), not more
    expect(renderCount).toBe(2);
  });

  it("should handle empty attributes correctly", () => {
    const { result } = renderHook(() => useAnalyticsRoot("TestComponent"));

    result.current.sendEvent({ name: "Clicked button" });

    expect(sendEventTrace).toHaveBeenCalledWith(
      { name: "Clicked button" },
      {
        "analytics.identifier": "TestComponent",
      },
    );
  });
});
