import React from "react";
import ReactDOM from "react-dom/client";
import { initializeHoneycomb } from "@evg-ui/lib/utils/observability";
import { initializeErrorHandling } from "components/ErrorHandling";
import { isDevelopmentBuild } from "utils/environmentVariables";
import App from "./App";

initializeErrorHandling();
initializeHoneycomb({
  apiKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  debug: isDevelopmentBuild(),
  endpoint: process.env.HONEYCOMB_ENDPOINT || "",
  serviceName: "parsley",
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
