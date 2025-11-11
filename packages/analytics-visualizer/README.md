# Analytics Visualizer

A Vite plugin that generates an HTML visualization of all analytics actions organized by identifier.

## Usage

```typescript
import analyticsVisualizer from "@evg-ui/analytics-visualizer";

export default defineConfig({
  plugins: [
    analyticsVisualizer({
      analyticsDir: "src/analytics",
      appName: "Parsley",
      honeycombDataset: "parsley",
    }),
  ],
});
```

## Options

- `analyticsDir` (required): Path to the analytics directory (relative to project root or absolute)
- `appName` (required): App name to display in the UI (e.g., "Parsley", "Spruce")
- `honeycombDataset` (required): Honeycomb dataset name (e.g., "parsley", "spruce")
- `outputFileName` (optional): Output file name (default: "analytics-visualization.html")
- `githubOwner` (optional): GitHub repository owner (default: "evergreen-ci")
- `githubRepo` (optional): GitHub repository name (default: "ui")
- `githubBranch` (optional): GitHub branch (default: "main")

