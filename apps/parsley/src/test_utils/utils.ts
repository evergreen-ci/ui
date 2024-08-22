const mockEnvironmentVariables = () => {
  // restoreCalls is an array of functions.
  const restoreCalls: (() => void)[] = [];

  const mockEnv = (variable: string, value: string) => {
    const before = process.env[variable];
    process.env[variable] = value;

    const restore = () => {
      process.env[variable] = before;
    };
    restoreCalls.push(restore);
  };

  const cleanup = () => {
    restoreCalls.forEach((restore) => {
      restore();
    });
  };

  return { cleanup, mockEnv };
};

/**
 * Tests if a function throws an error with a specific message.
 * @param func - The function expected to throw an error.
 * @param errorMessage - The expected error message substring.
 * @example
 * expectError(() => someFunction(), 'Expected error message');
 */
const expectError = (func: () => void, errorMessage: string) => {
  let err;
  try {
    func();
  } catch (e) {
    err = e;
  }
  expect(err).toBeInstanceOf(Error);
  expect((err as Error).message).toContain(errorMessage);
};

export { mockEnvironmentVariables, expectError };
