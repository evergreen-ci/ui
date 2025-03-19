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
  getReleaseStage,
  isDevelopmentBuild,
} from "utils/environmentVariables";
import App from "./App";
import routes, { slugs } from "./constants/routes";

const routeConfig = {
  ...routes,
  // Override the testLogs route to include the groupID parameter so that we can easily identify routes with groupID slugs in Honeycomb.
  testLogs: `${routes.testLogs}/:${slugs.groupID}?`,
};
initializeErrorHandling({
  environment: getReleaseStage(),
  isProductionBuild: !isDevelopmentBuild(),
  sentryDSN: process.env.REACT_APP_SENTRY_DSN || "",
});
initializeHoneycomb({
  appVersion: process.env.REACT_APP_VERSION || "",
  backendURL: toEscapedRegex(evergreenURL || ""),
  debug: isDevelopmentBuild(),
  endpoint: process.env.REACT_APP_HONEYCOMB_ENDPOINT || "",
  environment: getReleaseStage(),
  ingestKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  routeConfig,
  serviceName: "parsley",
});
injectOpenTelemetryAttributeStoreIntoWindow();

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
