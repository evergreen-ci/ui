import React from "react";
import { initializeHoneycomb } from "@evg-ui/lib/utils/observability";
import ReactDOM from "react-dom/client";
import { initializeErrorHandling } from "components/ErrorHandling";
import { getUiUrl } from "utils/environmentVariables";
import App from "./App";

initializeErrorHandling();
initializeHoneycomb({
  serviceName: "spruce",
  debug: true,
  endpoint: process.env.HONEYCOMB_ENDPOINT || "",
  uiUrl: getUiUrl(),
  apiKey: process.env.HONEYCOMB_API_KEY || "",
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
