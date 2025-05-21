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
 * @returns `true` if the current build is a production build.
 */
export const isProduction = () => getReleaseStage() === ReleaseStage.Production;

/**
 * `isProductionBuild()` indicates if the current environment is a production bundle.
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
 * `getEvergreenUrl()` - Get the backing evergreen URL from the environment variables
 * @returns - Returns the backing evergreen url
 */
export const getEvergreenUrl = () => process.env.REACT_APP_EVERGREEN_URL || "";
