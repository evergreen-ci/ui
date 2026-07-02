import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeErrorHandling } from "@evg-ui/lib/utils/errorReporting";
import {
  initializeHoneycomb,
  injectOpenTelemetryAttributeStoreIntoWindow,
} from "@evg-ui/lib/utils/observability";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import {
  getAppVersion,
  getReleaseStage,
  isDevelopmentBuild,
  getSentryDSN,
  sageAPIURL,
  getHoneycombEndpoint,
  getHoneycombIngestKey,
} from "utils/environmentVariables";
import App from "./App";

initializeErrorHandling({
  environment: getReleaseStage(),
  isProductionBuild: !isDevelopmentBuild(),
  sentryDSN: getSentryDSN(),
});

const routeConfig = {
  home: "/",
  agentDetail: "/agents/:agentId",
  agentRuns: "/agents/:agentId/runs/:runId",
};

initializeHoneycomb({
  appVersion: getAppVersion(),
  backendURL: toEscapedRegex(sageAPIURL),
  debug: isDevelopmentBuild(),
  endpoint: getHoneycombEndpoint(),
  environment: getReleaseStage(),
  ingestKey: getHoneycombIngestKey(),
  routeConfig,
  serviceName: "sage-ui",
});
injectOpenTelemetryAttributeStoreIntoWindow();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
