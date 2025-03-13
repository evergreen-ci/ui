enum ReleaseStage {
  Local = "local",
  Staging = "staging",
  Beta = "beta",
  Production = "production",
}

enum Environment {
  Development = "development",
  Production = "production",
}

const getReleaseStage = () => process.env.REACT_APP_RELEASE_STAGE || "";
const getSentryDSN = () => process.env.REACT_APP_PARSLEY_SENTRY_DSN || "";

const isLocal = () => getReleaseStage() === ReleaseStage.Local;
const isStaging = () => getReleaseStage() === ReleaseStage.Staging;
const isProduction = () => getReleaseStage() === ReleaseStage.Production;
/**
 * `getCorpLoginURL()` - Get the corp secure login URL from the environment variables
 * @returns - Returns the corp secure login URL
 */
const getCorpLoginURL: () => string = () =>
  process.env.REACT_APP_CORP_LOGIN_URL || "";

/**
 * `isRemoteEnv()` - Check if the current backend environment is a remote environment
 * @returns - Returns a boolean indicating if the current environment is a remote environment
 */
export const isRemoteEnv = (): boolean =>
  process.env.REACT_APP_REMOTE_ENV === "true";

const isProductionBuild = () => process.env.NODE_ENV === Environment.Production;
const isDevelopmentBuild = () =>
  isLocal() || process.env.NODE_ENV === Environment.Development;

const evergreenURL = process.env.REACT_APP_EVERGREEN_URL;
const graphqlURL = process.env.REACT_APP_GRAPHQL_URL;
const logkeeperURL = process.env.REACT_APP_LOGKEEPER_URL;
const spruceURL = process.env.REACT_APP_SPRUCE_URL;
const parsleyURL = process.env.REACT_APP_PARSLEY_URL;

export {
  isLocal,
  isStaging,
  isProduction,
  isProductionBuild,
  isDevelopmentBuild,
  evergreenURL,
  graphqlURL,
  logkeeperURL,
  spruceURL,
  getReleaseStage,
  getSentryDSN,
  getCorpLoginURL,
  parsleyURL,
};
