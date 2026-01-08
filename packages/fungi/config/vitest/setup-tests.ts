import "@testing-library/jest-dom/vitest";
import "vitest-canvas-mock";

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);

  const mockResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  vi.stubGlobal("ResizeObserver", mockResizeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});
