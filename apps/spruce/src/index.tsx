import React from "react";
import ReactDOM from "react-dom/client";
import {
  initializeHoneycomb,
  injectOpenTelemetryAttributeStoreIntoWindow,
} from "@evg-ui/lib/utils/observability";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import { initializeErrorHandling } from "components/ErrorHandling";
import { redirectRoutes, routes, slugs } from "constants/routes";
import {
  getAppVersion,
  getReleaseStage,
  getUiUrl,
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
initializeErrorHandling();
initializeHoneycomb({
  debug: isDevelopmentBuild(),
  endpoint: process.env.REACT_APP_HONEYCOMB_ENDPOINT || "",
  ingestKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  backendURL: toEscapedRegex(getUiUrl() || ""),
  serviceName: "spruce",
  environment: getReleaseStage(),
  appVersion: getAppVersion(),
  routeConfig,
});
injectOpenTelemetryAttributeStoreIntoWindow();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
