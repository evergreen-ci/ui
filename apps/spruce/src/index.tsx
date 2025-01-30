import React from "react";
import ReactDOM from "react-dom/client";
import {
  initializeHoneycomb,
  injectOpenTelemetryAttributeStoreIntoWindow,
} from "@evg-ui/lib/utils/observability";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import { initializeErrorHandling } from "components/ErrorHandling";
import { routes } from "constants/routes";
import {
  getReleaseStage,
  getUiUrl,
  isDevelopmentBuild,
} from "utils/environmentVariables";
import App from "./App";

initializeErrorHandling();
initializeHoneycomb({
  debug: isDevelopmentBuild(),
  endpoint: process.env.REACT_APP_HONEYCOMB_ENDPOINT || "",
  ingestKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  backendURL: toEscapedRegex(getUiUrl() || ""),
  serviceName: "spruce",
  environment: getReleaseStage(),
  routeConfig: routes,
});
injectOpenTelemetryAttributeStoreIntoWindow();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
