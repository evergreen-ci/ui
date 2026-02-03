import React from "react";
import { createRoot } from "react-dom/client";
import {
  initializeErrorHandling,
  initializeHoneycomb,
  injectOpenTelemetryAttributeStoreIntoWindow,
  toEscapedRegex,
} from "@evg-ui/lib/utils";
import { redirectRoutes, routes, slugs } from "constants/routes";
import {
  getAppVersion,
  getReleaseStage,
  getEvergreenUrl,
  isDevelopmentBuild,
} from "utils/environmentVariables";
import App from "./App";

const routeConfig = {
  ...routes,
  projectSettings: `${routes.projectSettings}/:${slugs.tab}?`,
  image: `${routes.image}/:${slugs.tab}?`,
  distroSettings: `${routes.distroSettings}/:${slugs.tab}?`,
  preferences: `${routes.preferences}/:${slugs.tab}?`,
  spawn: `${routes.spawn}/:${slugs.tab}?`,
  jobLogsLogkeeper: `${routes.jobLogs}/:${slugs.buildId}?/:${slugs.groupId}?`,
  jobLogsEvergreen: `${routes.jobLogs}/:${slugs.taskId}/:${slugs.execution}/:${slugs.groupId}`,
  patchRedirect: redirectRoutes.patch,
};
initializeErrorHandling({
  environment: getReleaseStage(),
  isProductionBuild: !isDevelopmentBuild(),
  sentryDSN: process.env.REACT_APP_SPRUCE_SENTRY_DSN || "",
});
initializeHoneycomb({
  debug: isDevelopmentBuild(),
  endpoint: process.env.REACT_APP_HONEYCOMB_ENDPOINT || "",
  ingestKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  backendURL: toEscapedRegex(getEvergreenUrl() || ""),
  serviceName: "spruce",
  environment: getReleaseStage(),
  appVersion: getAppVersion(),
  routeConfig,
});
injectOpenTelemetryAttributeStoreIntoWindow();

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
