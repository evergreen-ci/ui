/**
 * Constants used throughout the analytics visualizer
 */

/** Files to exclude when scanning the analytics directory */
export const EXCLUDED_FILES = [
  "index.ts",
  "types.ts",
  "useAnalyticAttributes.ts",
] as const;

/** Default time range for Honeycomb queries (7 days in seconds) */
export const DEFAULT_HONEYCOMB_TIME_RANGE = 604800;

/** Honeycomb base URL */
export const HONEYCOMB_BASE_URL =
  "https://ui.honeycomb.io/mongodb-4b/environments/production/datasets";

/** Default GitHub configuration */
export const DEFAULT_GITHUB_CONFIG = {
  owner: "evergreen-ci",
  repo: "ui",
  branch: "main",
} as const;

/** Default output file name */
export const DEFAULT_OUTPUT_FILE_NAME = "analytics-visualization.html";

/** Type name to look for in analytics files */
export const ACTION_TYPE_NAME = "Action";

/** Hook name to look for in analytics files */
export const USE_ANALYTICS_ROOT_HOOK = "useAnalyticsRoot";

/** Property name that identifies an action */
export const ACTION_NAME_PROPERTY = "name";
