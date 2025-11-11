import * as fs from "fs";
import * as path from "path";
import {
  DEFAULT_HONEYCOMB_TIME_RANGE,
  HONEYCOMB_BASE_URL,
} from "./constants.ts";
import type { IdentifierData, AnalyticsVisualizerOptions } from "./types.ts";

/**
 * Extracts unique action name prefixes from analytics data
 * @param data
 */
function extractActionPrefixes(data: IdentifierData[]): string[] {
  const prefixes = new Set<string>();

  for (const item of data) {
    for (const action of item.actions) {
      // Extract the first word(s) as prefix - typically the verb
      // For example: "Clicked task link" -> "clicked"
      const firstWord = action.name.split(/\s+/)[0]?.toLowerCase();
      if (firstWord) {
        prefixes.add(firstWord);
      }
    }
  }

  return Array.from(prefixes).sort();
}

/**
 * Escapes HTML special characters
 * @param text
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generates HTML content for the analytics visualization
 * @param data
 * @param options
 */
export function generateHTML(
  data: IdentifierData[],
  options: Required<AnalyticsVisualizerOptions>,
): string {
  // Sort data by identifier
  const sortedData = [...data].sort((a, b) =>
    a.identifier.localeCompare(b.identifier),
  );

  // Extract unique action prefixes
  const actionPrefixes = extractActionPrefixes(sortedData);

  // Generate Honeycomb URL helper for actions
  const generateHoneycombUrl = (actionName: string): string => {
    const query = {
      time_range: DEFAULT_HONEYCOMB_TIME_RANGE,
      granularity: 0,
      calculations: [{ op: "COUNT" }],
      filters: [
        { column: "library.name", op: "=", value: "analytics" },
        { column: "name", op: "=", value: actionName },
      ],
      filter_combination: "AND",
      limit: 1000,
      compare_time_offset_seconds: null,
    };

    const queryString = encodeURIComponent(JSON.stringify(query));
    return `${HONEYCOMB_BASE_URL}/${options.honeycombDataset}?query=${queryString}`;
  };

  // Generate Honeycomb URL helper for identifiers
  const generateHoneycombIdentifierUrl = (identifier: string): string => {
    const query = {
      time_range: DEFAULT_HONEYCOMB_TIME_RANGE,
      granularity: 0,
      breakdowns: ["name"],
      calculations: [{ op: "COUNT" }],
      filters: [
        { column: "library.name", op: "=", value: "analytics" },
        { column: "analytics.identifier", op: "=", value: identifier },
      ],
      filter_combination: "AND",
      orders: [{ op: "COUNT", order: "descending" }],
    };

    const queryString = encodeURIComponent(JSON.stringify(query));
    return `${HONEYCOMB_BASE_URL}/${options.honeycombDataset}?query=${queryString}`;
  };

  // Generate GitHub search URL helper
  const generateGitHubSearchUrl = (actionName: string): string => {
    const searchQuery = encodeURIComponent(`"${actionName}"`);
    return `https://github.com/${options.githubOwner}/${options.githubRepo}/search?q=${searchQuery}&type=code`;
  };

  // Generate GitHub file URL helper
  const generateGitHubFileUrl = (filePath: string): string => {
    // Convert absolute path to relative path from project root
    // Find the project root (where .git would be)
    let currentDir = path.dirname(filePath);
    let projectRoot: string | null = null;

    while (currentDir !== path.dirname(currentDir)) {
      if (fs.existsSync(path.join(currentDir, ".git"))) {
        projectRoot = currentDir;
        break;
      }
      currentDir = path.dirname(currentDir);
    }

    if (!projectRoot) {
      // Fallback: try to find apps/ directory and work backwards
      const appsMatch = filePath.match(/(.*\/apps\/[^/]+)/);
      if (appsMatch) {
        projectRoot = path.resolve(appsMatch[1], "../../");
      } else {
        // Last resort: assume we're in the repo root
        projectRoot = path.dirname(filePath);
      }
    }

    // Get relative path from project root
    const relativePath = path.relative(projectRoot, filePath);

    // GitHub URL format: https://github.com/owner/repo/blob/branch/path
    return `https://github.com/${options.githubOwner}/${options.githubRepo}/blob/${options.githubBranch}/${relativePath.replace(/\\/g, "/")}`;
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.appName} Analytics Actions Visualization</title>
  <style>
    :root {
      --color-charcoal-dark: #21313C;
      --color-slate-gray: #6B7C89;
      --color-green: #13AA52;
      --color-white: white;
      --color-gray-light: #F7F7F7;
      --color-mint-light: #F0F4F2;
      --color-mint-very-light: #E8F4F1;
      --color-gray-border: #E8EDEB;
      --color-gray-scrollbar: #D1D9D6;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: var(--color-white);
      color: var(--color-charcoal-dark);
      line-height: 1.5;
      height: 100vh;
      overflow: hidden;
    }

    /* Layout */
    .container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    aside {
      width: 280px;
      background: var(--color-gray-light);
      border-right: 1px solid var(--color-gray-border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Header */
    header {
      border-bottom: 1px solid var(--color-gray-border);
      background: var(--color-white);
    }

    h1 {
      font-size: 18px;
      font-weight: 600;
      padding: 16px;
    }

    h2 {
      font-size: 20px;
      font-weight: 600;
    }

    /* Form elements */
    input, select {
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      line-height: 1.5;
      border: 1px solid var(--color-gray-border);
      border-radius: 4px;
      background: var(--color-white);
      color: var(--color-charcoal-dark);
      transition: border-color 0.15s;
      height: 36px;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--color-green);
    }

    select {
      cursor: pointer;
      margin-top: 8px;
    }

    /* Navigation */
    nav {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }

    nav a {
      display: block;
      padding: 10px 16px;
      color: var(--color-charcoal-dark);
      text-decoration: none;
      font-size: 14px;
      transition: background-color 0.15s;
      border-left: 3px solid transparent;
    }

    nav a:hover {
      background: var(--color-mint-light);
    }

    nav a.active {
      background: var(--color-mint-very-light);
      border-left-color: var(--color-green);
      font-weight: 500;
    }

    /* Content */
    .content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    section {
      margin-bottom: 32px;
      scroll-margin-top: 24px;
    }

    section:last-child {
      margin-bottom: 0;
    }

    section > header {
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--color-gray-border);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Cards */
    article {
      padding: 16px;
      margin-bottom: 12px;
      background: var(--color-white);
      border: 1px solid var(--color-gray-border);
      border-radius: 4px;
    }

    article:last-child {
      margin-bottom: 0;
    }

    article > header {
      font-size: 16px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--color-gray-border);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    article > header > span {
      font-weight: 600;
    }

    article > header:only-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    /* Links */
    a {
      color: var(--color-green);
      text-decoration: none;
      opacity: 0.7;
      transition: opacity 0.15s;
    }

    a:hover {
      opacity: 1;
      text-decoration: underline;
    }

    /* Utility classes */
    .text-muted {
      color: var(--color-slate-gray);
    }

    .text-small {
      font-size: 12px;
    }

    .text-monospace {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
    }

    .ml-auto {
      margin-left: auto;
    }

    .separator {
      color: var(--color-slate-gray);
      opacity: 0.5;
    }

    /* Property list */
    ul {
      list-style: none;
    }

    li {
      margin: 8px 0;
      padding: 8px 12px;
      background: var(--color-gray-light);
      border-radius: 4px;
      border-left: 3px solid var(--color-green);
    }

    li strong {
      font-weight: 500;
    }

    li .text-small {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    /* States */
    .hidden {
      display: none;
    }

    .empty-state {
      padding: 40px;
      text-align: center;
      color: var(--color-slate-gray);
      font-size: 14px;
    }

    /* Scrollbar */
    nav::-webkit-scrollbar,
    .content::-webkit-scrollbar {
      width: 8px;
    }

    nav::-webkit-scrollbar-track,
    .content::-webkit-scrollbar-track {
      background: transparent;
    }

    nav::-webkit-scrollbar-thumb,
    .content::-webkit-scrollbar-thumb {
      background: var(--color-gray-border);
      border-radius: 4px;
    }

    nav::-webkit-scrollbar-thumb:hover,
    .content::-webkit-scrollbar-thumb:hover {
      background: var(--color-gray-scrollbar);
    }
  </style>
</head>
<body>
  <div class="container">
    <aside>
      <header>
        <h1>${escapeHtml(options.appName)} Analytics</h1>
      </header>
      <div style="padding: 16px; border-bottom: 1px solid var(--color-gray-border); background: var(--color-white);">
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
        <a href="#identifier-${item.identifier}" data-identifier="${item.identifier}">
          ${item.identifier}
          <span class="text-muted text-small">(${item.actions.length})</span>
        </a>
        `,
          )
          .join("")}
      </nav>
    </aside>

    <main>
      <div class="content" id="content">
        ${sortedData
          .map((item) => {
            const githubFileUrl = generateGitHubFileUrl(item.filePath);
            return `
        <section id="identifier-${item.identifier}" data-identifier="${item.identifier}">
          <header>
            <h2>${item.identifier}</h2>
            <span class="text-muted">${item.actions.length} action${item.actions.length !== 1 ? "s" : ""}</span>
            <a href="${escapeHtml(generateHoneycombIdentifierUrl(item.identifier))}" target="_blank" rel="noopener noreferrer" class="ml-auto text-small">View in Honeycomb</a>
            <span class="separator text-small">&bull;</span>
            <a href="${escapeHtml(githubFileUrl)}" target="_blank" rel="noopener noreferrer" class="text-small">View on GitHub</a>
          </header>
          ${item.actions
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((action) => {
              const honeycombUrl = generateHoneycombUrl(action.name);
              const githubUrl = generateGitHubSearchUrl(action.name);
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
            })
            .join("")}
        </section>
        `;
          })
          .join("")}
      </div>

      <div class="empty-state hidden" id="noResults">
        No results found matching your search.
      </div>
    </main>
  </div>

  <script>
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Smooth scroll to identifier section
    function scrollToIdentifier(identifier) {
      const element = document.getElementById('identifier-' + identifier);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Update active sidebar item based on scroll position
    function updateActiveSidebarItem() {
      const sections = document.querySelectorAll('section:not(.hidden)');
      const navItems = document.querySelectorAll('nav a');
      const contentArea = document.querySelector('.content');
      
      if (!contentArea || sections.length === 0) return;
      
      let currentActive = null;
      const scrollTop = contentArea.scrollTop;
      const headerOffset = 100; // Account for header height
      const viewportTop = scrollTop + headerOffset;
      
      // Find the section currently in view
      sections.forEach((section) => {
        // Use getBoundingClientRect to get position relative to viewport
        const sectionRect = section.getBoundingClientRect();
        const contentRect = contentArea.getBoundingClientRect();
        
        // Calculate absolute position within content area
        const sectionTop = sectionRect.top - contentRect.top + scrollTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        // Check if section is in viewport (with some offset)
        if (viewportTop >= sectionTop && viewportTop < sectionBottom) {
          currentActive = section.getAttribute('data-identifier');
        }
      });
      
      // If no section is in view, find the last visible one that's above the viewport
      if (!currentActive) {
        let lastAbove = null;
        let lastTop = -Infinity;
        sections.forEach((section) => {
          const sectionRect = section.getBoundingClientRect();
          const contentRect = contentArea.getBoundingClientRect();
          const sectionTop = sectionRect.top - contentRect.top + scrollTop;
          
          if (sectionTop <= viewportTop && sectionTop > lastTop) {
            lastTop = sectionTop;
            lastAbove = section.getAttribute('data-identifier');
          }
        });
        currentActive = lastAbove;
      }
      
      navItems.forEach(item => {
        const identifier = item.getAttribute('data-identifier');
        if (identifier === currentActive) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    // Sidebar navigation click handlers
    document.addEventListener('DOMContentLoaded', function() {
      const navItems = document.querySelectorAll('nav a');
      navItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          const identifier = this.getAttribute('data-identifier');
          scrollToIdentifier(identifier);
        });
      });

      // Update active item on scroll
      const contentArea = document.querySelector('.content');
      contentArea.addEventListener('scroll', updateActiveSidebarItem);
      
      // Initial update
      updateActiveSidebarItem();
    });

    // Filter functionality
    function applyFilters() {
      const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
      const prefixFilter = document.getElementById('prefixFilterSelect').value.toLowerCase().trim();
      const actionItems = document.querySelectorAll('article');
      const identifierSections = document.querySelectorAll('section');
      const noResults = document.getElementById('noResults');
      let hasResults = false;

      // Filter actions
      actionItems.forEach(item => {
        const actionName = item.getAttribute('data-action-name');
        const properties = item.getAttribute('data-properties');
        let matches = true;

        // Apply search filter (matches anywhere in name or properties)
        if (searchQuery !== '') {
          const text = (actionName + ' ' + properties).toLowerCase();
          if (!text.includes(searchQuery)) {
            matches = false;
          }
        }

        // Apply prefix filter (matches start of action name)
        if (matches && prefixFilter !== '') {
          if (!actionName.startsWith(prefixFilter)) {
            matches = false;
          }
        }

        if (matches) {
          item.classList.remove('hidden');
          hasResults = true;
        } else {
          item.classList.add('hidden');
        }
      });

      // Show/hide identifier sections based on visible actions
      identifierSections.forEach(section => {
        const identifier = section.getAttribute('data-identifier');
        const visibleActions = section.querySelectorAll('article:not(.hidden)');
        
        if (visibleActions.length > 0) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });

      // Show no results message
      if (hasResults) {
        noResults.classList.add('hidden');
      } else {
        noResults.classList.remove('hidden');
      }

      // Update active sidebar item after filtering
      updateActiveSidebarItem();
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', applyFilters);

    // ActionTypePrefix filter functionality
    const prefixFilterSelect = document.getElementById('prefixFilterSelect');
    prefixFilterSelect.addEventListener('change', applyFilters);
  </script>
</body>
</html>`;

  return html;
}
