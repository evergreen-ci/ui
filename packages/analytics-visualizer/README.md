# Analytics Visualizer

A Vite plugin that generates an HTML visualization of all analytics actions organized by identifier.

## Usage

```typescript
import analyticsVisualizer from "@evg-ui/analytics-visualizer";

export default defineConfig({
  plugins: [
    analyticsVisualizer({
      analyticsDir: [
        "src/analytics",
        "../../packages/lib/src/analytics/hooks",
      ],
      appName: "Parsley",
      honeycombBaseUrl: "https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/parsley",
    }),
  ],
});
```

## Options

- `analyticsDir` (required): Path or array of paths to the analytics directory (each relative to project root or absolute).
- `appName` (required): App name to display in the UI (e.g., "Parsley", "Spruce")
- `honeycombBaseUrl` (required): Honeycomb base URL including dataset path (e.g., "https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/parsley")
- `outputFileName` (optional): Output file name (default: "analytics.html")
- `githubOwner` (optional): GitHub repository owner (default: "evergreen-ci")
- `githubRepo` (optional): GitHub repository name (default: "ui")
- `githubBranch` (optional): GitHub branch (default: "main")

