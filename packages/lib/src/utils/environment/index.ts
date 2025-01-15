/**
 * `getReleaseStage()` - Get the release stage from the environment variables
 * @returns - Returns the production release environment
 */
export const getReleaseStage = () => process.env.REACT_APP_RELEASE_STAGE || "";

/**
 * `getUserStagingKey()` - Get the user-specific staging key configured by the deploy task.
 * @returns - Returns the user's staging key.
 */
export const getUserStagingKey = (): string =>
  process.env.REACT_APP_USER_KEY || "";

/**
 * `isStaging()` indicates if the current build is a build meant for a staging deployment.
 * @returns `true` if the current build is a staging build.
 */
export const isStaging = (): boolean => getReleaseStage() === "staging";
