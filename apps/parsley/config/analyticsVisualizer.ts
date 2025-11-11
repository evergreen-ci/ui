import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ActionProperty = {
  name: string;
  type: string;
  optional: boolean;
};

type Action = {
  name: string;
  properties: ActionProperty[];
};

type IdentifierData = {
  identifier: string;
  actions: Action[];
  filePath: string; // Path to the file where this identifier is defined
};

/**
 * Extracts TypeScript type as a string representation
 * @param typeNode
 * @param checker
 * @param program
 */
function getTypeString(
  typeNode: ts.TypeNode,
  checker: ts.TypeChecker,
  program?: ts.Program,
): string {
  if (ts.isLiteralTypeNode(typeNode)) {
    if (ts.isStringLiteral(typeNode.literal)) {
      return `"${typeNode.literal.text}"`;
    }
    if (ts.isNumericLiteral(typeNode.literal)) {
      return typeNode.literal.text;
    }
    if (typeNode.literal.kind === ts.SyntaxKind.TrueKeyword) {
      return "true";
    }
    if (typeNode.literal.kind === ts.SyntaxKind.FalseKeyword) {
      return "false";
    }
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    return typeNode.typeName.getText();
  }

  if (ts.isUnionTypeNode(typeNode)) {
    return typeNode.types
      .map((t) => getTypeString(t, checker, program))
      .join(" | ");
  }

  if (ts.isArrayTypeNode(typeNode)) {
    return `${getTypeString(typeNode.elementType, checker, program)}[]`;
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    return "object";
  }

  return typeNode.getText();
}

/**
 * Extracts properties from an object type literal
 * @param node
 * @param checker
 * @param program
 */
function extractProperties(
  node: ts.TypeLiteralNode,
  checker: ts.TypeChecker,
  program?: ts.Program,
): ActionProperty[] {
  const properties: ActionProperty[] = [];

  for (const member of node.members) {
    if (ts.isPropertySignature(member)) {
      const name = member.name?.getText() || "";
      const optional = !!member.questionToken;

      if (member.type) {
        const typeString = getTypeString(member.type, checker, program);
        properties.push({
          name,
          type: typeString,
          optional,
        });
      } else {
        properties.push({ name, type: "any", optional });
      }
    }
  }

  return properties;
}

/**
 * Extracts actions from a union type
 * @param typeNode
 * @param checker
 * @param program
 */
function extractActions(
  typeNode: ts.TypeAliasDeclaration,
  checker: ts.TypeChecker,
  program: ts.Program,
): Action[] {
  const actions: Action[] = [];

  if (typeNode.type && ts.isUnionTypeNode(typeNode.type)) {
    for (const unionMember of typeNode.type.types) {
      if (ts.isTypeLiteralNode(unionMember)) {
        // Find the 'name' property
        const nameProperty = unionMember.members.find(
          (m) =>
            ts.isPropertySignature(m) &&
            m.name?.getText() === "name" &&
            ts.isLiteralTypeNode(m.type!) &&
            ts.isStringLiteral(m.type!.literal),
        ) as ts.PropertySignature | undefined;

        if (nameProperty) {
          const nameLiteral = (nameProperty.type as ts.LiteralTypeNode)
            .literal as ts.StringLiteral;
          const actionName = nameLiteral.text;

          // Extract all properties
          const properties = extractProperties(unionMember, checker, program);

          actions.push({
            name: actionName,
            properties: properties.filter((p) => p.name !== "name"), // Exclude 'name' from properties list
          });
        }
      }
    }
  }

  return actions;
}

/**
 * Extracts identifier from useAnalyticsRoot call
 * @param sourceFile
 */
function extractIdentifier(sourceFile: ts.SourceFile): string | null {
  let identifier: string | null = null;

  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node)) {
      // Check if it's useAnalyticsRoot - could be an identifier or property access
      const { expression } = node;
      let isUseAnalyticsRoot = false;

      if (ts.isIdentifier(expression)) {
        // Direct call: useAnalyticsRoot(...)
        isUseAnalyticsRoot = expression.getText() === "useAnalyticsRoot";
      } else if (ts.isPropertyAccessExpression(expression)) {
        // Property access: something.useAnalyticsRoot(...)
        isUseAnalyticsRoot = expression.name.getText() === "useAnalyticsRoot";
      }

      if (isUseAnalyticsRoot) {
        // Get the first argument (the identifier string)
        if (node.arguments.length > 0) {
          const arg = node.arguments[0];
          if (ts.isStringLiteral(arg)) {
            identifier = arg.text;
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return identifier;
}

/**
 * Parses a TypeScript file and extracts analytics data
 * @param filePath
 */
function parseAnalyticsFile(filePath: string): IdentifierData | null {
  try {
    // Find project root and load tsconfig
    let currentDir = path.dirname(filePath);
    let projectRoot: string | null = null;
    let tsconfigPath: string | null = null;

    while (currentDir !== path.dirname(currentDir)) {
      const potentialTsconfig = path.join(currentDir, "tsconfig.json");
      if (fs.existsSync(potentialTsconfig)) {
        tsconfigPath = potentialTsconfig;
        projectRoot = currentDir;
        break;
      }
      currentDir = path.dirname(currentDir);
    }

    if (!tsconfigPath || !projectRoot) {
      return null;
    }

    // Read and parse tsconfig.json
    const tsconfigContent = fs.readFileSync(tsconfigPath, "utf-8");
    const tsconfig = ts.parseConfigFileTextToJson(
      tsconfigPath,
      tsconfigContent,
    );

    if (tsconfig.error) {
      return null;
    }

    // Parse compiler options
    const parsedConfig = ts.parseJsonConfigFileContent(
      tsconfig.config,
      ts.sys,
      projectRoot,
    );

    const compilerOptions: ts.CompilerOptions = {
      ...parsedConfig.options,
      skipLibCheck: true,
    };

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const sourceFile = ts.createSourceFile(
      filePath,
      fileContent,
      compilerOptions.target || ts.ScriptTarget.Latest,
      true,
    );

    // Create a module resolution host
    const moduleResolutionHost: ts.ModuleResolutionHost = {
      fileExists: (fileName: string) => fs.existsSync(fileName),
      readFile: (fileName: string) => fs.readFileSync(fileName, "utf-8"),
      getCurrentDirectory: () => projectRoot!,
    };

    // Recursively collect all imported files using TypeScript's module resolution
    const filesToInclude = new Set<string>();
    const processedFiles = new Set<string>();

    const collectImportsRecursively = (filePath: string) => {
      if (processedFiles.has(filePath)) {
        return; // Avoid cycles
      }
      processedFiles.add(filePath);
      filesToInclude.add(filePath);

      if (!fs.existsSync(filePath)) {
        return;
      }

      const content = fs.readFileSync(filePath, "utf-8");
      const fileSource = ts.createSourceFile(
        filePath,
        content,
        compilerOptions.target || ts.ScriptTarget.Latest,
        true,
      );

      const visit = (node: ts.Node) => {
        // Handle both regular imports and type-only imports
        if (ts.isImportDeclaration(node)) {
          const { moduleSpecifier } = node;
          if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
            const importPath = moduleSpecifier.text;

            // Skip external packages
            if (
              importPath.startsWith("@evg-ui/") ||
              importPath.startsWith("@")
            ) {
              return;
            }

            // Use TypeScript's module resolution
            const resolved = ts.resolveModuleName(
              importPath,
              filePath,
              compilerOptions,
              moduleResolutionHost,
            );

            if (
              resolved.resolvedModule &&
              resolved.resolvedModule.resolvedFileName
            ) {
              const resolvedPath = resolved.resolvedModule.resolvedFileName;

              // Only process TypeScript source files (not .d.ts or node_modules)
              if (
                resolvedPath.endsWith(".ts") ||
                resolvedPath.endsWith(".tsx")
              ) {
                // Check if it's within the src directory
                const srcDir = path.join(projectRoot!, "src");
                if (resolvedPath.startsWith(srcDir)) {
                  collectImportsRecursively(resolvedPath);
                }
              }
            }
          }
        }
        ts.forEachChild(node, visit);
      };

      visit(fileSource);
    };

    // Start collecting from the source file
    collectImportsRecursively(filePath);

    const filesArray = Array.from(filesToInclude);

    const program = ts.createProgram(filesArray, compilerOptions);
    const checker = program.getTypeChecker();

    // Find the Action type alias
    let actionTypeNode: ts.TypeAliasDeclaration | null = null;

    const visit = (node: ts.Node) => {
      if (ts.isTypeAliasDeclaration(node) && node.name.getText() === "Action") {
        actionTypeNode = node;
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    if (!actionTypeNode) {
      return null;
    }

    // Extract identifier
    const identifier = extractIdentifier(sourceFile);
    if (!identifier) {
      return null;
    }

    // Extract actions
    const actions = extractActions(actionTypeNode, checker, program);

    if (actions.length === 0) {
      return null;
    }

    return {
      identifier,
      actions,
      filePath,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Scans the analytics directory for all analytics files
 * @param analyticsDir
 */
function scanAnalyticsDirectory(analyticsDir: string): IdentifierData[] {
  const results: IdentifierData[] = [];

  /**
   *
   * @param dir
   */
  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".d.ts") &&
        entry.name !== "index.ts" &&
        entry.name !== "types.ts" &&
        entry.name !== "useAnalyticAttributes.ts"
      ) {
        const data = parseAnalyticsFile(fullPath);
        if (data) {
          results.push(data);
        }
      }
    }
  }

  scanDir(analyticsDir);
  return results;
}

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
 * Generates a Honeycomb URL for an action
 * @param actionName
 */
function generateHoneycombUrl(actionName: string): string {
  const query = {
    time_range: 604800,
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
  return `https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/parsley?query=${queryString}`;
}

/**
 * Generates a GitHub search URL for an action
 * @param actionName
 */
function generateGitHubSearchUrl(actionName: string): string {
  const searchQuery = encodeURIComponent(`"${actionName}"`);
  return `https://github.com/evergreen-ci/ui/search?q=${searchQuery}&type=code`;
}

/**
 * Generates a GitHub URL for a file path
 * @param filePath
 */
function generateGitHubFileUrl(filePath: string): string {
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
    // Fallback: try to find apps/parsley and work backwards
    const parsleyMatch = filePath.match(/(.*\/apps\/parsley)/);
    if (parsleyMatch) {
      projectRoot = path.resolve(parsleyMatch[1], "../../");
    } else {
      // Last resort: assume we're in the repo root
      projectRoot = path.dirname(filePath);
    }
  }

  // Get relative path from project root
  const relativePath = path.relative(projectRoot, filePath);

  // GitHub URL format: https://github.com/owner/repo/blob/branch/path
  // We'll use "main" as the branch (could be improved to detect actual branch)
  return `https://github.com/evergreen-ci/ui/blob/main/${relativePath.replace(/\\/g, "/")}`;
}

/**
 * Generates HTML content for the analytics visualization
 * @param data
 */
function generateHTML(data: IdentifierData[]): string {
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
  <title>Parsley Analytics Actions Visualization</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: white;
      color: #21313C;
      line-height: 1.5;
      height: 100vh;
      overflow: hidden;
    }

    .app-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 280px;
      background: #F7F7F7;
      border-right: 1px solid #E8EDEB;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid #E8EDEB;
      background: white;
    }

    .sidebar-header h1 {
      font-size: 18px;
      font-weight: 600;
      color: #21313C;
    }

    .sidebar-search {
      padding: 16px;
      border-bottom: 1px solid #E8EDEB;
      background: white;
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }

    .sidebar-nav-item {
      display: block;
      padding: 10px 16px;
      color: #21313C;
      text-decoration: none;
      font-size: 14px;
      transition: background-color 0.15s;
      border-left: 3px solid transparent;
      cursor: pointer;
    }

    .sidebar-nav-item:hover {
      background: #F0F4F2;
    }

    .sidebar-nav-item.active {
      background: #E8F4F1;
      border-left-color: #13AA52;
      font-weight: 500;
    }

    .sidebar-nav-item-count {
      color: #6B7C89;
      font-size: 12px;
      margin-left: 8px;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .search-box {
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #E8EDEB;
      border-radius: 4px;
      background: white;
      color: #21313C;
      transition: border-color 0.15s;
    }

    .search-box:focus {
      outline: none;
      border-color: #13AA52;
    }

    .prefix-select {
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #E8EDEB;
      border-radius: 4px;
      background: white;
      color: #21313C;
      cursor: pointer;
      transition: border-color 0.15s;
      margin-top: 8px;
    }

    .prefix-select:focus {
      outline: none;
      border-color: #13AA52;
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .identifier-section {
      margin-bottom: 32px;
      scroll-margin-top: 24px;
    }

    .identifier-section:last-child {
      margin-bottom: 0;
    }

    .identifier-header {
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 1px solid #E8EDEB;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .identifier-title {
      font-size: 20px;
      font-weight: 600;
      color: #21313C;
    }

    .identifier-count {
      color: #6B7C89;
      font-size: 14px;
    }

    .identifier-github-link {
      font-size: 12px;
      font-weight: 400;
      color: #13AA52;
      text-decoration: none;
      opacity: 0.7;
      transition: opacity 0.15s;
      margin-left: auto;
    }

    .identifier-github-link:hover {
      opacity: 1;
      text-decoration: underline;
    }

    .action-item {
      padding: 16px;
      margin-bottom: 12px;
      background: white;
      border: 1px solid #E8EDEB;
      border-radius: 4px;
    }

    .action-item:last-child {
      margin-bottom: 0;
    }

    .action-name {
      font-size: 16px;
      font-weight: 600;
      color: #21313C;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #E8EDEB;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .action-name.no-properties {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .honeycomb-link,
    .github-link {
      font-size: 12px;
      font-weight: 400;
      color: #13AA52;
      text-decoration: none;
      opacity: 0.7;
      transition: opacity 0.15s;
    }

    .honeycomb-link:hover,
    .github-link:hover {
      opacity: 1;
      text-decoration: underline;
    }

    .link-separator {
      color: #6B7C89;
      opacity: 0.5;
      margin: 0 4px;
      vertical-align: middle;
    }

    .property-item {
      margin: 8px 0;
      padding: 8px 12px;
      background: #F7F7F7;
      border-radius: 4px;
      border-left: 3px solid #13AA52;
    }

    .property-name {
      font-weight: 500;
      color: #21313C;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
    }

    .property-type {
      color: #6B7C89;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      margin-left: 8px;
      font-size: 13px;
    }

    .property-optional {
      color: #6B7C89;
      font-size: 12px;
      margin-left: 8px;
    }

    .hidden {
      display: none;
    }

    .no-results {
      padding: 40px;
      text-align: center;
      color: #6B7C89;
      font-size: 14px;
    }

    /* Scrollbar styling */
    .sidebar-nav::-webkit-scrollbar,
    .content-area::-webkit-scrollbar {
      width: 8px;
    }

    .sidebar-nav::-webkit-scrollbar-track,
    .content-area::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-nav::-webkit-scrollbar-thumb,
    .content-area::-webkit-scrollbar-thumb {
      background: #E8EDEB;
      border-radius: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover,
    .content-area::-webkit-scrollbar-thumb:hover {
      background: #D1D9D6;
    }
  </style>
</head>
<body>
  <div class="app-container">
    <div class="sidebar">
      <div class="sidebar-header">
        <h1>Parsley Analytics</h1>
      </div>
      <div class="sidebar-search">
        <input
          type="text"
          class="search-box"
          id="searchInput"
          placeholder="Search actions or properties..."
        />
        <select
          class="prefix-select"
          id="prefixFilterSelect"
        >
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
      <nav class="sidebar-nav" id="sidebarNav">
        ${sortedData
          .map(
            (item) => `
        <a href="#identifier-${item.identifier}" class="sidebar-nav-item" data-identifier="${item.identifier}">
          ${item.identifier}
          <span class="sidebar-nav-item-count">(${item.actions.length})</span>
        </a>
        `,
          )
          .join("")}
      </nav>
    </div>

    <div class="main-content">
      <div class="content-area" id="content">
        ${sortedData
          .map((item) => {
            const githubFileUrl = generateGitHubFileUrl(item.filePath);
            return `
        <div class="identifier-section" id="identifier-${item.identifier}" data-identifier="${item.identifier}">
          <div class="identifier-header">
            <span class="identifier-title">${item.identifier}</span>
            <span class="identifier-count">${item.actions.length} action${item.actions.length !== 1 ? "s" : ""}</span>
            <a href="${escapeHtml(githubFileUrl)}" target="_blank" rel="noopener noreferrer" class="identifier-github-link">View on GitHub</a>
          </div>
          ${item.actions
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((action) => {
              const honeycombUrl = generateHoneycombUrl(action.name);
              const githubUrl = generateGitHubSearchUrl(action.name);
              return `
          <div class="action-item" data-action-name="${action.name.toLowerCase()}" data-properties="${action.properties.map((p) => p.name.toLowerCase()).join(" ")}">
            <div class="action-name${action.properties.length === 0 ? " no-properties" : ""}">
              <span>${action.name}</span>
              <a href="${escapeHtml(honeycombUrl)}" target="_blank" rel="noopener noreferrer" class="honeycomb-link">View in Honeycomb</a>
              <span class="link-separator">&bull;</span>
              <a href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" class="github-link">Search on GitHub</a>
            </div>
            ${
              action.properties.length > 0
                ? `
            <div class="action-properties">
              ${action.properties
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(
                  (prop) => `
              <div class="property-item">
                <span class="property-name">${prop.name}</span>
                <span class="property-type">
                  ${escapeHtml(prop.type)}
                </span>
                ${prop.optional ? '<span class="property-optional">(optional)</span>' : ""}
              </div>
              `,
                )
                .join("")}
            </div>
            `
                : ""
            }
          </div>
          `;
            })
            .join("")}
        </div>
        `;
          })
          .join("")}
      </div>

      <div class="no-results hidden" id="noResults">
        No results found matching your search.
      </div>
    </div>
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
      const sections = document.querySelectorAll('.identifier-section:not(.hidden)');
      const navItems = document.querySelectorAll('.sidebar-nav-item');
      const contentArea = document.querySelector('.content-area');
      
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
      const navItems = document.querySelectorAll('.sidebar-nav-item');
      navItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          const identifier = this.getAttribute('data-identifier');
          scrollToIdentifier(identifier);
        });
      });

      // Update active item on scroll
      const contentArea = document.querySelector('.content-area');
      contentArea.addEventListener('scroll', updateActiveSidebarItem);
      
      // Initial update
      updateActiveSidebarItem();
    });

    // Filter functionality
    function applyFilters() {
      const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
      const prefixFilter = document.getElementById('prefixFilterSelect').value.toLowerCase().trim();
      const actionItems = document.querySelectorAll('.action-item');
      const identifierSections = document.querySelectorAll('.identifier-section');
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
        const visibleActions = section.querySelectorAll('.action-item:not(.hidden)');
        
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
 * Analytics Visualizer Vite Plugin
 * Generates an HTML visualization of all analytics actions organized by identifier
 */
export default function analyticsVisualizer() {
  return {
    name: "analyticsVisualizer",
    enforce: "post" as const,
    writeBundle: async (options: { dir?: string; file?: string }) => {
      try {
        // Get output directory from options, fallback to dist relative to project root
        const outputDir = options.dir || path.resolve(__dirname, "../dist");

        const analyticsDir = path.resolve(__dirname, "../src/analytics");

        if (!fs.existsSync(analyticsDir)) {
          return;
        }

        const data = scanAnalyticsDirectory(analyticsDir);

        if (data.length === 0) {
          return;
        }

        const html = generateHTML(data);

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.resolve(
          outputDir,
          "analytics-visualization.html",
        );
        fs.writeFileSync(outputPath, html, "utf-8");
      } catch (error) {
        // Silently fail - this is a build-time plugin
      }
    },
  };
}
