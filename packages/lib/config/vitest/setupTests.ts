// jest-dom adds custom matchers for asserting on DOM nodes. Works for Vitest too!
import "@testing-library/jest-dom";
import "vitest-canvas-mock";

// Workaround for a bug in @testing-library/react.
// It prevents Vitest's fake timers from functioning with user-event.
// https://github.com/testing-library/react-testing-library/issues/1197
// @ts-expect-error
globalThis.jest = {
  ...globalThis.jest,
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
};
