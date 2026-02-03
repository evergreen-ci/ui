export {
  Environment,
  ReleaseStage,
  getReleaseStage,
  isDevelopmentBuild,
  isEndUserProduction,
  isLocal,
  isProduction,
  isProductionBuild,
  isStaging,
  isTest,
} from "@evg-ui/lib/utils";

const getSentryDSN = () => process.env.REACT_APP_PARSLEY_SENTRY_DSN || "";

const evergreenURL = process.env.REACT_APP_EVERGREEN_URL;
const graphqlURL = process.env.REACT_APP_GRAPHQL_URL;
const logkeeperURL = process.env.REACT_APP_LOGKEEPER_URL;
const spruceURL = process.env.REACT_APP_SPRUCE_URL;
const parsleyURL = process.env.REACT_APP_PARSLEY_URL;
const parsleyAIURL = import.meta.env.VITE_PARSLEY_AI_URL;

export {
  getSentryDSN,
  evergreenURL,
  graphqlURL,
  logkeeperURL,
  spruceURL,
  parsleyAIURL,
  parsleyURL,
};
