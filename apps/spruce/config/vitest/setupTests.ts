// jest-dom adds custom matchers for asserting on DOM nodes. Works for Vitest too!
import "@testing-library/jest-dom";
import "vitest-canvas-mock";
import React from "react";

// @ts-expect-error: Returning a basic string is acceptable for tests.
window.crypto.randomUUID = (() => {
  let value = 0;
  return () => {
    value += 1;
    return value.toString();
  };
})();

// @ts-expect-error: Workaround for a bug in @testing-library/react.
// It prevents Vitest's fake timers from functioning with user-event.
// https://github.com/testing-library/react-testing-library/issues/1197
globalThis.jest = {
  ...globalThis.jest,
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
};

// LeafyGreen tables require an IntersectionObserver.
beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);
});

vi.mock(
  "@leafygreen-ui/search-input/node_modules/@leafygreen-ui/icon-button",
  () => ({
    __esModule: true,
    default: vi
      .fn()
      .mockImplementation(({ children, ...props }) =>
        React.createElement(
          "button",
          { ...props, "aria-label": props["aria-label"] || "Mock button" },
          children,
        ),
      ),
  }),
);

afterEach(() => {
  vi.unstubAllGlobals();
});
