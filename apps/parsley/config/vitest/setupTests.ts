// jest-dom adds custom jest matchers for asserting on DOM nodes. Works for vitest too!
import "@testing-library/jest-dom";

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

// Workaround for a bug in @testing-library/react.
// It prevents Vitest's fake timers from functioning with user-event.
// https://github.com/testing-library/react-testing-library/issues/1197
globalThis.jest = {
  ...globalThis.jest,
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
};
