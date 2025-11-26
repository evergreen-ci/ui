import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { generateContent } from "./site/content.ts";
import { generateSidebar } from "./site/sidebar.ts";
import type { IdentifierData, AnalyticsVisualizerOptions } from "./types.ts";
import { extractActionPrefixes, escapeHtml } from "./utils.ts";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read external asset files at build time
const CSS = readFileSync(join(__dirname, "site", "styles.css"), "utf-8");
const SCRIPT = readFileSync(join(__dirname, "site", "script.js"), "utf-8");
const HTML_TEMPLATE = readFileSync(
  join(__dirname, "site", "template.html"),
  "utf-8",
);

/**
 * Generates HTML content for the analytics visualization
 * @param data - Array of identifier data containing analytics actions
 * @param options - Configuration options for the visualization
 * @returns Complete HTML string for the visualization page
 */
export const generateHTML = (
  data: IdentifierData[],
  options: Required<AnalyticsVisualizerOptions>,
): string => {
  // Sort data by identifier
  const sortedData = [...data].sort((a, b) =>
    a.identifier.localeCompare(b.identifier),
  );

  // Extract unique action prefixes
  const actionPrefixes = extractActionPrefixes(sortedData);

  // Generate dynamic content
  const sidebar = generateSidebar(sortedData, actionPrefixes, options);
  const content = generateContent(sortedData, options);
  const title = `${escapeHtml(options.appName)} Analytics Actions Visualization`;

  // Replace placeholders in template
  const html = HTML_TEMPLATE.replace("{{TITLE}}", title)
    .replace("{{CSS}}", CSS)
    .replace("{{SCRIPT}}", SCRIPT)
    .replace("{{SIDEBAR}}", sidebar)
    .replace("{{CONTENT}}", content);

  return html;
};
