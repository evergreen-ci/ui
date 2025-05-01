// jest-dom adds custom matchers for asserting on DOM nodes. Works for Vitest too!
import "@testing-library/jest-dom";
import "vitest-canvas-mock";

process.env.EMOTION_DETERMINISTIC = "1";

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

beforeAll(() => {
  const moduleCache = Object.entries(require.cache);
  for (const [key, module] of moduleCache) {
    if (
      (key.includes("@emotion") || key.includes("@leafygreen-ui/emotion")) &&
      module?.exports?.cache
    ) {
      if (
        module.exports.cache &&
        module.exports.cache.sheet &&
        module.exports.cache.sheet.container
      ) {
        module.exports.cache.sheet.container.dataset.deterministic = "true";
      }
    }
  }
});

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

afterEach(() => {
  vi.unstubAllGlobals();
});
