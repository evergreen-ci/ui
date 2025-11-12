import type {
  IdentifierData,
  AnalyticsVisualizerOptions,
  Action,
} from "../types.ts";
import {
  escapeHtml,
  generateHoneycombUrl,
  generateHoneycombIdentifierUrl,
  generateGitHubSearchUrl,
  generateGitHubFileUrl,
} from "../utils.ts";

/**
 * Generates HTML for a single action/article
 * @param action - The action to render
 * @param options - Configuration options
 * @returns HTML string for the action
 */
const generateAction = (
  action: Action,
  options: Required<AnalyticsVisualizerOptions>,
): string => {
  const honeycombUrl = generateHoneycombUrl(
    action.name,
    options.honeycombBaseUrl,
  );
  const githubUrl = generateGitHubSearchUrl(
    action.name,
    options.githubOwner,
    options.githubRepo,
  );

  return `
          <article data-action-name="${action.name.toLowerCase()}" data-properties="${action.properties.map((p) => p.name.toLowerCase()).join(" ")}">
            <header>
              <span>${action.name}</span>
              <a href="${escapeHtml(honeycombUrl)}" target="_blank" rel="noopener noreferrer" class="ml-auto text-small">View in Honeycomb</a>
              <span class="separator text-small">&bull;</span>
              <a href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" class="text-small">Search on GitHub</a>
            </header>
            ${
              action.properties.length > 0
                ? `
            <ul>
              ${action.properties
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(
                  (prop) => `
              <li class="text-monospace">
                <strong>${prop.name}</strong>
                <span class="text-muted">${escapeHtml(prop.type)}</span>
                ${prop.optional ? '<span class="text-muted text-small">(optional)</span>' : ""}
              </li>
              `,
                )
                .join("")}
            </ul>
            `
                : ""
            }
          </article>
          `;
};

/**
 * Generates HTML for a single identifier section
 * @param item - The identifier data to render
 * @param options - Configuration options
 * @returns HTML string for the section
 */
const generateSection = (
  item: IdentifierData,
  options: Required<AnalyticsVisualizerOptions>,
): string => {
  const githubFileUrl = generateGitHubFileUrl(
    item.filePath,
    options.githubOwner,
    options.githubRepo,
    options.githubBranch,
  );

  return `
        <section id="identifier-${item.identifier}" data-identifier="${item.identifier}">
          <header>
            <h2>${item.identifier}</h2>
            <span class="text-muted">${item.actions.length} action${item.actions.length !== 1 ? "s" : ""}</span>
            <a href="${escapeHtml(generateHoneycombIdentifierUrl(item.identifier, options.honeycombBaseUrl))}" target="_blank" rel="noopener noreferrer" class="ml-auto text-small">View in Honeycomb</a>
            <span class="separator text-small">&bull;</span>
            <a href="${escapeHtml(githubFileUrl)}" target="_blank" rel="noopener noreferrer" class="text-small">View on GitHub</a>
          </header>
          ${item.actions
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((action) => generateAction(action, options))
            .join("")}
        </section>
        `;
};

/**
 * Generates the main content area HTML
 * @param sortedData - Sorted array of identifier data
 * @param options - Configuration options
 * @returns HTML string for the content area
 */
export const generateContent = (
  sortedData: IdentifierData[],
  options: Required<AnalyticsVisualizerOptions>,
): string => `
    <main>
      <div class="content" id="content">
        ${sortedData.map((item) => generateSection(item, options)).join("")}
      </div>

      <div class="empty-state hidden" id="noResults">
        No results found matching your search.
      </div>
    </main>
  `;
