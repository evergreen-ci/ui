import { renderHook } from "@evg-ui/lib/test_utils";
import useIntersectionObserver from ".";

describe("useIntersectionObserver", () => {
  it("should call the callback when the element is not intersecting", () => {
    const mockIntersectionObserver = vi.fn(function (callback) {
      callback([
        {
          isIntersecting: false,
        },
      ]);
      return {
        disconnect: vi.fn(),
        observe: vi.fn(),
      };
    });

    // @ts-expect-error: Not necessary to mock the entire object for a test.
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
    const mockIntersectionObserver = vi.fn(function (callback) {
      callback([
        {
          isIntersecting: true,
        },
      ]);
      return {
        disconnect: vi.fn(),
        observe: vi.fn(),
      };
    });

    // @ts-expect-error: Not necessary to mock the entire object for a test.
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
