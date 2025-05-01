// jest-dom adds custom matchers for asserting on DOM nodes. Works for Vitest too!
import "@testing-library/jest-dom";

process.env.EMOTION_DETERMINISTIC = "1";

// The following two variables are dummy values used in auth.test.tsx.
process.env.REACT_APP_EVERGREEN_URL = "http://test-evergreen.com";
process.env.REACT_APP_GRAPHQL_URL = "http://test-graphql.com";
process.env.REACT_APP_SPRUCE_URL = "http://test-spruce.com";

if (process.env.CI) {
  // Avoid printing debug statements when running tests.
  vi.spyOn(console, "debug").mockImplementation(() => {});

  // Avoid printing error statements when running tests.
  vi.spyOn(console, "error").mockImplementation(() => {});

  // Avoid printing analytics events when running tests, but print any other console.log statements.
  const consoleLog = console.log;
  console.log = (message: string) => {
    if (message.startsWith("ANALYTICS EVENT")) {
      return;
    }
    consoleLog(message);
  };
}

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

// @ts-expect-error: Workaround for a bug in @testing-library/react.
// It prevents Vitest's fake timers from functioning with user-event.
// https://github.com/testing-library/react-testing-library/issues/1197
globalThis.jest = {
  // @ts-expect-error
  ...globalThis.jest,
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
};
