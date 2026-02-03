import { MockedProvider, renderHook } from "test_utils";
import { useQueryCompleted } from ".";

const Provider = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[]}>{children}</MockedProvider>
);

describe("useQueryCompleted", () => {
  it("should not call callback when loading is false initially", () => {
    const callback = vi.fn();
    renderHook(() => useQueryCompleted(false, callback), {
      wrapper: Provider,
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call callback when loading is true", () => {
    const callback = vi.fn();
    renderHook(() => useQueryCompleted(true, callback), {
      wrapper: Provider,
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("should call callback when loading transitions from true to false", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ loading }) => useQueryCompleted(loading, callback),
      {
        wrapper: Provider,
        initialProps: { loading: true },
      },
    );
    expect(callback).not.toHaveBeenCalled();

    // Transition to loaded state.
    rerender({ loading: false });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback multiple times on re-renders", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ loading }) => useQueryCompleted(loading, callback),
      {
        wrapper: Provider,
        initialProps: { loading: true },
      },
    );

    // Transition to loaded state.
    rerender({ loading: false });
    expect(callback).toHaveBeenCalledTimes(1);

    // Re-render multiple times with same loading state.
    rerender({ loading: false });
    rerender({ loading: false });
    rerender({ loading: false });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should call callback again when query refetches", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ loading }) => useQueryCompleted(loading, callback),
      {
        wrapper: Provider,
        initialProps: { loading: true },
      },
    );

    // Transition to loaded state.
    rerender({ loading: false });
    expect(callback).toHaveBeenCalledTimes(1);

    // Query refetches (loading becomes true again).
    rerender({ loading: true });
    expect(callback).toHaveBeenCalledTimes(1);

    // Refetch completes.
    rerender({ loading: false });
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
