type MockEnvironmentVariables = {
  /**
   * Cleans up the mocked environment variables.
   */
  cleanup: () => void;
  /**
   * Mocks an environment variable.
   * @param variable - The environment variable to mock.
   * @param value - The value to set the environment variable to.
   */
  mockEnv: (variable: string, value: string) => void;
};

/**
 * Creates mock environment variables for testing purposes.
 * @returns An object with `cleanup` and `mockEnv` functions.
 */
export const mockEnvironmentVariables = (): MockEnvironmentVariables => {
  // restoreCalls is an array of functions.
  const restoreCalls: (() => void)[] = [];

  const mockEnv = (variable: string, value: string): void => {
    const before = process.env[variable];
    process.env[variable] = value;

    const restore = () => {
      if (before === undefined) {
        delete process.env[variable];
      } else {
        process.env[variable] = before;
      }
    };
    restoreCalls.push(restore);
  };

  const cleanup = (): void => {
    restoreCalls.forEach((restore) => {
      restore();
    });
  };

  return { cleanup, mockEnv };
};
