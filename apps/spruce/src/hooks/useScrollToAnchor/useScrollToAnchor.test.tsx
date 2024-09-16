import { MemoryRouter } from "react-router-dom";
import { renderHook } from "@evg-ui/lib/test_utils";
import useScrollToAnchor from ".";

describe("useScrollToAnchor", () => {
  const mockElement = { scrollIntoView: vi.fn() };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(document, "getElementById").mockReturnValue(
      mockElement as any as HTMLElement,
    );
    mockElement.scrollIntoView.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should scroll to element when hash is present", () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={["/#test-anchor"]}>{children}</MemoryRouter>
    );

    renderHook(() => useScrollToAnchor(), { wrapper });
    vi.advanceTimersByTime(500);

    expect(document.getElementById).toHaveBeenCalledWith("test-anchor");
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });

  it("should not scroll when hash is not present", () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    );

    renderHook(() => useScrollToAnchor(), { wrapper });
    vi.advanceTimersByTime(500);

    expect(document.getElementById).not.toHaveBeenCalled();
  });

  it("should clear timeout on unmount", () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={["/#test-anchor"]}>{children}</MemoryRouter>
    );

    const { unmount } = renderHook(() => useScrollToAnchor(), { wrapper });
    unmount();
    vi.advanceTimersByTime(500);

    expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
  });
});
