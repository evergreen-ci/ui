import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeErrorHandling } from "@evg-ui/lib/utils/errorReporting";
import {
  initializeHoneycomb,
  injectOpenTelemetryAttributeStoreIntoWindow,
} from "@evg-ui/lib/utils/observability";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import { routeConfig } from "constants/routes";
import {
  getAppVersion,
  getReleaseStage,
  isDevelopmentBuild,
  getSentryDSN,
  sageAPIURL,
} from "utils/environmentVariables";
import App from "./App";

initializeErrorHandling({
  environment: getReleaseStage(),
  isProductionBuild: !isDevelopmentBuild(),
  sentryDSN: getSentryDSN(),
});

initializeHoneycomb({
  appVersion: getAppVersion(),
  backendURL: toEscapedRegex(sageAPIURL),
  debug: isDevelopmentBuild(),
  endpoint: process.env.REACT_APP_HONEYCOMB_ENDPOINT || "",
  environment: getReleaseStage(),
  ingestKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  routeConfig,
  serviceName: "sage-ui",
});
injectOpenTelemetryAttributeStoreIntoWindow();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
