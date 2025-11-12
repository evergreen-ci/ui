export type ActionProperty = {
  name: string;
  type: string;
  optional: boolean;
};

export type Action = {
  name: string;
  properties: ActionProperty[];
};

export type IdentifierData = {
  identifier: string;
  actions: Action[];
  filePath: string;
};

export type AnalyticsVisualizerOptions = {
  /** Path to the analytics directory (relative to project root or absolute) */
  analyticsDir: string;
  /** Output file name (default: "analytics-visualization.html") */
  outputFileName?: string;
  /** App name to display in the UI (e.g., "Parsley", "Spruce") */
  appName: string;
  /** Honeycomb base URL (e.g., "https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/parsley") */
  honeycombBaseUrl: string;
  /** GitHub repository owner (default: "evergreen-ci") */
  githubOwner?: string;
  /** GitHub repository name (default: "ui") */
  githubRepo?: string;
  /** GitHub branch (default: "main") */
  githubBranch?: string;
};
