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
  getAppVersion,
  getHoneycombEndpoint,
  getHoneycombIngestKey,
} from "@evg-ui/lib/utils/environmentVariables";

const getSentryDSN = () => import.meta.env.VITE_SAGE_SENTRY_DSN || "";
const sageAPIURL = import.meta.env.VITE_SAGE_API_URL || "";

export { getSentryDSN, sageAPIURL };
