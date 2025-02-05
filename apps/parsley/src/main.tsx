import React from "react";
import ReactDOM from "react-dom/client";
import {
  initializeHoneycomb,
  injectOpenTelemetryAttributeStoreIntoWindow,
} from "@evg-ui/lib/utils/observability";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import { initializeErrorHandling } from "components/ErrorHandling";
import {
  evergreenURL,
  getReleaseStage,
  isDevelopmentBuild,
} from "utils/environmentVariables";
import App from "./App";
import routes from "./constants/routes";

initializeErrorHandling();
initializeHoneycomb({
  backendURL: toEscapedRegex(evergreenURL || ""),
  debug: isDevelopmentBuild(),
  endpoint: process.env.REACT_APP_HONEYCOMB_ENDPOINT || "",
  environment: getReleaseStage(),
  ingestKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  routeConfig: routes,
  serviceName: "parsley",
});
injectOpenTelemetryAttributeStoreIntoWindow();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
