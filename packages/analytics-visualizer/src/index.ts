import type { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";
import {
  DEFAULT_GITHUB_CONFIG,
  DEFAULT_OUTPUT_FILE_NAME,
} from "./constants.ts";
import { generateHTML } from "./generator.ts";
import { scanAnalyticsDirectory } from "./parser.ts";
import type { AnalyticsVisualizerOptions } from "./types.ts";

/**
 * Analytics Visualizer Vite Plugin
 *
 * Generates an HTML visualization of all analytics actions organized by identifier.
 * The visualization includes:
 * - Searchable/filterable list of all analytics actions
 * - Links to Honeycomb for each action and identifier
 * - Links to GitHub for searching action usage
 * @param options - Configuration options for the plugin
 * @returns A Vite plugin instance
 * @example
 * ```typescript
 * import analyticsVisualizer from "@evg-ui/analytics-visualizer";
 *
 * export default defineConfig({
 *   plugins: [
 *     analyticsVisualizer({
 *       analyticsDir: "src/analytics",
 *       appName: "Parsley",
 *       honeycombBaseUrl: `${process.env.REACT_APP_HONEYCOMB_BASE_URL}/datasets/parsley`,
 *     }),
 *   ],
 * });
 * ```
 */
const analyticsVisualizer = (options: AnalyticsVisualizerOptions): Plugin => {
  const resolvedOptions: Required<AnalyticsVisualizerOptions> = {
    analyticsDir: options.analyticsDir,
    outputFileName: options.outputFileName || DEFAULT_OUTPUT_FILE_NAME,
    appName: options.appName,
    honeycombBaseUrl: options.honeycombBaseUrl,
    githubOwner: options.githubOwner || DEFAULT_GITHUB_CONFIG.owner,
    githubRepo: options.githubRepo || DEFAULT_GITHUB_CONFIG.repo,
    githubBranch: options.githubBranch || DEFAULT_GITHUB_CONFIG.branch,
  };

  return {
    name: "analyticsVisualizer",
    enforce: "post" as const,
    writeBundle: async (bundleOptions: { dir?: string; file?: string }) => {
      try {
        // Get output directory from options, fallback to dist relative to process.cwd()
        const outputDir =
          bundleOptions.dir || path.resolve(process.cwd(), "dist");

        // Resolve analytics directory (can be relative to process.cwd() or absolute)
        const analyticsDir = path.isAbsolute(resolvedOptions.analyticsDir)
          ? resolvedOptions.analyticsDir
          : path.resolve(process.cwd(), resolvedOptions.analyticsDir);

        const data = scanAnalyticsDirectory(analyticsDir);
        const html = generateHTML(data, resolvedOptions);

        fs.mkdirSync(outputDir, { recursive: true });

        const outputPath = path.resolve(
          outputDir,
          resolvedOptions.outputFileName,
        );
        fs.writeFileSync(outputPath, html, "utf-8");
      } catch (error) {
        // Log error but don't fail the build
        console.error(
          `[analyticsVisualizer] Failed to generate visualization:`,
          error instanceof Error ? error.message : error,
        );
      }
    },
  };
};

export default analyticsVisualizer;
