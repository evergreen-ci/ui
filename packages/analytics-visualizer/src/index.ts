import type { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";
import { generateHTML } from "./generator.ts";
import { scanAnalyticsDirectory } from "./parser.ts";
import type { AnalyticsVisualizerOptions } from "./types.ts";

/**
 * Analytics Visualizer Vite Plugin
 * Generates an HTML visualization of all analytics actions organized by identifier
 * @param options
 */
export default function analyticsVisualizer(
  options: AnalyticsVisualizerOptions,
): Plugin {
  const resolvedOptions: Required<AnalyticsVisualizerOptions> = {
    analyticsDir: options.analyticsDir,
    outputFileName: options.outputFileName || "analytics-visualization.html",
    appName: options.appName,
    honeycombDataset: options.honeycombDataset,
    githubOwner: options.githubOwner || "evergreen-ci",
    githubRepo: options.githubRepo || "ui",
    githubBranch: options.githubBranch || "main",
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

        if (!fs.existsSync(analyticsDir)) {
          return;
        }

        const data = scanAnalyticsDirectory(analyticsDir);

        if (data.length === 0) {
          return;
        }

        const html = generateHTML(data, resolvedOptions);

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.resolve(
          outputDir,
          resolvedOptions.outputFileName,
        );
        fs.writeFileSync(outputPath, html, "utf-8");
      } catch (error) {
        // Silently fail - this is a build-time plugin
      }
    },
  };
}
