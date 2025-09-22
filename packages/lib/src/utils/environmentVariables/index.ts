/**
 * Environment variables utility functions shared between Spruce and Parsley
 */

export enum ReleaseStage {
  Local = "local",
  Staging = "staging",
  Beta = "beta",
  Production = "production",
}

export enum Environment {
  Development = "development",
  Production = "production",
  Test = "test",
}

/**
 * `getReleaseStage()` - Get the release stage from the environment variables
 * @returns - Returns the production release environment
 */
export const getReleaseStage = () => process.env.REACT_APP_RELEASE_STAGE || "";

/**
 * `isLocal()` indicates if the current build is a local build.
 * @returns `true` if the current build is a local build.
 */
export const isLocal = () => getReleaseStage() === ReleaseStage.Local;

/**
 * `isBeta()` indicates if the current build is a build meant for a beta deployment.
 * @returns `true` if the current build is a beta build.
 */
export const isBeta = () => getReleaseStage() === ReleaseStage.Beta;

/**
 * `isStaging()` indicates if the current build is a build meant for a staging deployment.
 * @returns `true` if the current build is a staging build.
 */
export const isStaging = () => getReleaseStage() === ReleaseStage.Staging;

/**
 * `isProduction()` indicates if the current build is a build meant for a production deployment.
 * @see {@link isEndUserProduction} if implementing a feature flag
 * @returns `true` if the current build is a production build.
 */
export const isProduction = () => getReleaseStage() === ReleaseStage.Production;

/**
 * `isProductionBuild()` indicates if the current environment is a production bundle.
 * @see {@link isEndUserProduction} if implementing a feature flag
 * @returns `true` if the current environment is a production build.
 */
export const isProductionBuild = () =>
  process.env.NODE_ENV === Environment.Production;

/**
 * `isDevelopmentBuild()` indicates if the current environment is a local development environment.
 * @returns `true` if the current environment is a local development environment.
 */
export const isDevelopmentBuild = () =>
  isLocal() || process.env.NODE_ENV === Environment.Development;

/**
 * `isTest()` indicates if the current environment is a test environment.
 * @returns `true` if the current environment is a test environment.
 */
export const isTest = () => process.env.NODE_ENV === Environment.Test;

/**
 * `isEndUserProduction()` targets the end-user environment, useful for feature flags.
 * @returns `true` only on <app>.mongodb.com
 */
export const isEndUserProduction = () => isProduction() && isProductionBuild();

/**
 * `getEvergreenUrl()` - Get the backing evergreen URL from the environment variables
 * @returns - Returns the backing evergreen url
 */
export const getEvergreenUrl = () => process.env.REACT_APP_EVERGREEN_URL || "";

/**
 * `getSignalProcessingUrl()` - Get the TIPS Signal Processing URL from the environment variables
 * @returns - Returns the TIPS Signal Processing Iframe URL
 */
export const getSignalProcessingUrl = () =>
  process.env.REACT_APP_SIGNAL_PROCESSING_URL || "";

/**
 * `getApiUrl()` - Get the API URL from the environment variables
 * @returns - The Evergreen API URL
 */
export const getApiUrl = () => `${getEvergreenUrl()}/api`;

/**
 * `getSentryDSN()` - Get the Sentry Data Source Name (SENTRY_DSN) from the environment variables
 * @returns - The application's DSN
 */
export const getSentryDSN = () => process.env.REACT_APP_SPRUCE_SENTRY_DSN || "";

/**
 * `getSpruceURL()` - Get the SPRUCE URL from the environment variables
 * @returns - Returns the Spruce URL
 */
export const getSpruceURL = () => process.env.REACT_APP_SPRUCE_URL || "";

/**
 * `getGQLUrl()` - Get the GQL URL from the environment variables
 * @returns - Returns the graphql endpoint for the current environment.
 */
export const getGQLUrl = () => `${getEvergreenUrl()}/graphql/query`;

/**
 * `getParsleyUrl()` - Get the Parsley URL from the environment variables
 * @returns - Returns the Parsley URL.
 */
export const getParsleyUrl = () => process.env.REACT_APP_PARSLEY_URL || "";

/**
 * `getAppVersion()` - Get the app release version from the environment variables
 * @returns - Returns the release version.
 */
export const getAppVersion = () => process.env.REACT_APP_VERSION || "";

/**
 * `getHoneycombBaseURL()` - Get the base Honeycomb URL from the environment variables
 * @returns - Returns the base Honeycomb URL
 */
export const getHoneycombBaseURL = () =>
  process.env.REACT_APP_HONEYCOMB_BASE_URL || "";

/**
 * `getUserStagingKey()` - Get the user-specific staging key configured by the deploy task.
 * @returns - Returns the user's staging key.
 */
export const getUserStagingKey = (): string =>
  process.env.REACT_APP_USER_KEY || "";

/**
 * `getLoginDomain()` - Get the login domain depending on the release stage
 * @returns - Returns the login domain
 * in development, the dev server on port 3000 proxies the local evergreen server on port 9090
 * therefore in dev we want the login domain to be localhost:3000
 * however in prod and staging and we want the login domain to be evergreen.com
 */
export const getLoginDomain = () =>
  isDevelopmentBuild() || getReleaseStage() === ReleaseStage.Local
    ? process.env.REACT_APP_SPRUCE_URL || ""
    : process.env.REACT_APP_EVERGREEN_URL || "";
