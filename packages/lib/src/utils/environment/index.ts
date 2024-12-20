/**
 * `getUserStagingKey()` - Get the user-specific staging key configured by the deploy task.
 * @returns - Returns the user's staging key.
 */
export const getUserStagingKey = (): string =>
  process.env.REACT_APP_USER_KEY || "";
