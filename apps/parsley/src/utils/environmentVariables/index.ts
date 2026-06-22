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
  getAppVersion,
  getHoneycombIngestKey,
  getHoneycombEndpoint,
} from "@evg-ui/lib/utils/environmentVariables";

const getSentryDSN = () => import.meta.env.VITE_PARSLEY_SENTRY_DSN || "";

const evergreenURL = import.meta.env.VITE_EVERGREEN_URL;
const graphqlURL = import.meta.env.VITE_GRAPHQL_URL;
const spruceURL = process.env.REACT_APP_SPRUCE_URL;
const parsleyURL = import.meta.env.VITE_PARSLEY_URL;
const parsleyAIURL = import.meta.env.VITE_PARSLEY_AI_URL;

export {
  getSentryDSN,
  evergreenURL,
  graphqlURL,
  spruceURL,
  parsleyAIURL,
  parsleyURL,
};
