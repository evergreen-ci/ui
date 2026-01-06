import "@testing-library/jest-dom/vitest";
import "vitest-canvas-mock";

// @ts-expect-error: Workaround for a bug in @testing-library/react.
// It prevents Vitest's fake timers from functioning with user-event.
// https://github.com/testing-library/react-testing-library/issues/1197
globalThis.jest = {
  ...globalThis.jest,
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
};
