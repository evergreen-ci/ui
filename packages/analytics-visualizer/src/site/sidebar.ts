import type { IdentifierData, AnalyticsVisualizerOptions } from "../types.ts";
import { escapeHtml, toSlug } from "../utils.ts";

/**
 * Generates the sidebar HTML
 * @param sortedData - Sorted array of identifier data
 * @param actionPrefixes - Array of action name prefixes
 * @param options - Configuration options
 * @returns HTML string for the sidebar
 */
export const generateSidebar = (
  sortedData: IdentifierData[],
  actionPrefixes: string[],
  options: Required<AnalyticsVisualizerOptions>,
): string => `
    <aside>
      <header>
        <h1>${escapeHtml(options.appName)} Analytics</h1>
      </header>
      <div style="padding: 1rem; border-bottom: 1px solid var(--color-gray-border); background: var(--color-white);">
        <input
          type="text"
          id="searchInput"
          placeholder="Search actions or properties..."
        />
        <select id="prefixFilterSelect">
          <option value="">All Action Types</option>
          ${actionPrefixes
            .map(
              (prefix) => `
          <option value="${escapeHtml(prefix)}">${prefix.charAt(0).toUpperCase() + prefix.slice(1)}</option>
          `,
            )
            .join("")}
        </select>
      </div>
      <nav id="sidebarNav">
        ${sortedData
          .map(
            (item) => `
        <a href="#identifier-${toSlug(item.identifier)}" data-identifier="${item.identifier}">
          ${item.identifier}
          <span class="text-muted text-small">(${item.actions.length})</span>
        </a>
        `,
          )
          .join("")}
      </nav>
    </aside>
  `;
