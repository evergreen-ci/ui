import type { IdentifierData, AnalyticsVisualizerOptions } from "./types.ts";
import { extractActionPrefixes, escapeHtml } from "./utils.ts";
import { CSS } from "./site/styles.ts";
import { SCRIPT } from "./site/script.ts";
import { generateSidebar } from "./site/sidebar.ts";
import { generateContent } from "./site/content.ts";

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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(options.appName)} Analytics Actions Visualization</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="container">
    ${generateSidebar(sortedData, actionPrefixes, options)}
    ${generateContent(sortedData, options)}
  </div>

  <script>${SCRIPT}</script>
</body>
</html>`;

  return html;
};
