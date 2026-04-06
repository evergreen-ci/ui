import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeErrorHandling } from "@evg-ui/lib/utils/errorReporting";
import {
  initializeHoneycomb,
  injectOpenTelemetryAttributeStoreIntoWindow,
} from "@evg-ui/lib/utils/observability";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
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
  jobLogs: `${routes.jobLogs}/:${slugs.taskId}/:${slugs.execution}/:${slugs.groupId}`,
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

// Reload on stale chunk errors after deploys so users get the latest assets.
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

// After 24 hours, check on tab focus whether a new version has been deployed
// and reload if so. This ensures long-lived tabs eventually pick up new code.
if (!isDevelopmentBuild()) {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const loadTime = Date.now();
  const currentHash = document
    .querySelector('meta[name="git-hash"]')
    ?.getAttribute("content");

  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState !== "visible") return;
    if (Date.now() - loadTime < TWENTY_FOUR_HOURS) return;

    try {
      const res = await fetch("/commit.txt", { cache: "no-cache" });
      const deployedHash = (await res.text()).trim();
      if (deployedHash && deployedHash !== currentHash) {
        window.location.reload();
      }
    } catch {
      // Don't reload on network errors
    }
  });
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
