import React from "react";
import { createRoot } from "react-dom/client";
import { initializeErrorHandling } from "@evg-ui/lib/utils/errorReporting";
import {
  initializeHoneycomb,
  injectOpenTelemetryAttributeStoreIntoWindow,
} from "@evg-ui/lib/utils/observability";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import {
  evergreenURL,
  getAppVersion,
  getHoneycombEndpoint,
  getHoneycombIngestKey,
  getReleaseStage,
  getSentryDSN,
  isDevelopmentBuild,
} from "utils/environmentVariables";
import App from "./App";
import { observabilityRouteConfig } from "./constants/routes";

initializeErrorHandling({
  environment: getReleaseStage(),
  isProductionBuild: !isDevelopmentBuild(),
  sentryDSN: getSentryDSN(),
});
initializeHoneycomb({
  appVersion: getAppVersion(),
  backendURL: toEscapedRegex(evergreenURL || ""),
  debug: isDevelopmentBuild(),
  endpoint: getHoneycombEndpoint(),
  environment: getReleaseStage(),
  ingestKey: getHoneycombIngestKey(),
  routeConfig: observabilityRouteConfig,
  serviceName: "parsley",
});
injectOpenTelemetryAttributeStoreIntoWindow();

// Reload on stale chunk errors after deploys so users get the latest assets.
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
