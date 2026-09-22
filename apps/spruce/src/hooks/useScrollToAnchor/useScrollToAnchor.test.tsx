import { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";
import { renderHook } from "@evg-ui/lib/test_utils";
import useScrollToAnchor from ".";

describe("useScrollToAnchor", () => {
  const mockElement = { scrollIntoView: vi.fn() };
  const createWrapper = (initialEntries: string[]) =>
    function Wrapper({ children }: PropsWithChildren) {
      return (
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      );
    };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(document, "getElementById").mockReturnValue(
      mockElement as unknown as HTMLElement,
    );
    mockElement.scrollIntoView.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should scroll to element when hash is present", () => {
    renderHook(() => useScrollToAnchor(), {
      wrapper: createWrapper(["/#test-anchor"]),
    });
    vi.runOnlyPendingTimers();

    expect(document.getElementById).toHaveBeenCalledWith("test-anchor");
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });

  it("should not scroll when hash is not present", () => {
    renderHook(() => useScrollToAnchor(), { wrapper: createWrapper(["/"]) });
    vi.runOnlyPendingTimers();

    expect(document.getElementById).not.toHaveBeenCalled();
  });

  it("should wait until the anchor element is ready before scrolling", () => {
    const { rerender } = renderHook(
      ({ isReady }) => useScrollToAnchor(isReady),
      {
        initialProps: { isReady: false },
        wrapper: createWrapper(["/#test-anchor"]),
      },
    );
    vi.runOnlyPendingTimers();

    expect(document.getElementById).not.toHaveBeenCalled();

    rerender({ isReady: true });
    vi.runOnlyPendingTimers();

    expect(mockElement.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("should clear timeout on unmount", () => {
    const { unmount } = renderHook(() => useScrollToAnchor(), {
      wrapper: createWrapper(["/#test-anchor"]),
    });
    unmount();
    vi.runOnlyPendingTimers();

    expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
  });
});
