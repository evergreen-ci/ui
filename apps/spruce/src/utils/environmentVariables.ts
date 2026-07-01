export {
  getReleaseStage,
  isLocal,
  isBeta,
  isEndUserProduction,
  isStaging,
  isProduction,
  isProductionBuild,
  isDevelopmentBuild,
  getEvergreenUrl,
  getSignalProcessingUrl,
  getApiUrl,
  getSpruceURL,
  getGQLUrl,
  getParsleyUrl,
  getAppVersion,
  getHoneycombBaseURL,
  getLoginDomain,
  getHoneycombIngestKey,
  getHoneycombEndpoint,
} from "@evg-ui/lib/utils/environmentVariables";

export const getSentryDSN = () => import.meta.env.VITE_SPRUCE_SENTRY_DSN || "";
