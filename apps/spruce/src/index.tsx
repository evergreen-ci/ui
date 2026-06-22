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
  getHoneycombIngestKey,
  getHoneycombEndpoint,
  getSentryDSN,
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
  sentryDSN: getSentryDSN(),
});
initializeHoneycomb({
  appVersion: getAppVersion(),
  backendURL: toEscapedRegex(getEvergreenUrl() || ""),
  debug: isDevelopmentBuild(),
  endpoint: getHoneycombEndpoint(),
  environment: getReleaseStage(),
  ingestKey: getHoneycombIngestKey(),
  routeConfig,
  serviceName: "spruce",
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
      if (!res.ok) return;
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
