import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { useWaterfallTrace } from "./useWaterfallTrace";

const { end, startSpan } = vi.hoisted(() => {
  const endSpan = vi.fn();
  return { end: endSpan, startSpan: vi.fn(() => ({ end: endSpan })) };
});
vi.mock("@opentelemetry/api", () => ({
  trace: { getTracer: () => ({ startSpan }) },
}));

it("starts and finishes one render trace only after readiness becomes true", async () => {
  const { rerender } = renderHook(({ ready }) => useWaterfallTrace(ready), {
    initialProps: { ready: false },
  });
  expect(startSpan).not.toHaveBeenCalled();
  expect(end).not.toHaveBeenCalled();

  rerender({ ready: true });
  await waitFor(() => expect(end).toHaveBeenCalledTimes(1));
  expect(startSpan).toHaveBeenCalledExactlyOnceWith("Render waterfall");

  rerender({ ready: false });
  rerender({ ready: true });
  expect(startSpan).toHaveBeenCalledTimes(1);
  expect(end).toHaveBeenCalledTimes(1);
});
