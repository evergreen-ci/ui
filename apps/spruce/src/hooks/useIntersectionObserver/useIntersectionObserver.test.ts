import { renderHook } from "@evg-ui/lib/test_utils";
import useIntersectionObserver from ".";

describe("useIntersectionObserver", () => {
  it("should call the callback when the element is not intersecting", () => {
    const mockIntersectionObserver = vi.fn((callback) => {
      callback([
        {
          isIntersecting: false,
        },
      ]);
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    // @ts-expect-error
    window.IntersectionObserver = mockIntersectionObserver;
    const mockCallback = vi.fn();
    renderHook(() =>
      useIntersectionObserver(
        {
          current: document.createElement("div"),
        },
        mockCallback,
      ),
    );
    expect(mockCallback).toHaveBeenCalledWith([{ isIntersecting: false }]);
  });
  it("should call the callback when the element is intersecting", () => {
    const mockIntersectionObserver = vi.fn((callback) => {
      callback([
        {
          isIntersecting: true,
        },
      ]);
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    // @ts-expect-error
    window.IntersectionObserver = mockIntersectionObserver;
    const mockCallback = vi.fn();
    renderHook(() =>
      useIntersectionObserver(
        {
          current: document.createElement("div"),
        },
        mockCallback,
      ),
    );
    expect(mockCallback).toHaveBeenCalledWith([{ isIntersecting: true }]);
  });
});
