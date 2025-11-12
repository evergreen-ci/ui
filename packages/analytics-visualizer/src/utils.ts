import * as fs from "fs";
import * as path from "path";
import { DEFAULT_HONEYCOMB_TIME_RANGE } from "./constants.ts";
import type { IdentifierData } from "./types.ts";

/**
 * Extracts unique action name prefixes from analytics data
 * @param data - Array of identifier data containing analytics actions
 * @returns Sorted array of unique action name prefixes (typically verbs)
 */
export const extractActionPrefixes = (data: IdentifierData[]): string[] => {
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
};

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param text - The text to escape
 * @returns The escaped text with HTML special characters replaced
 */
export const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/**
 * Generates a Honeycomb URL for a specific action
 * @param actionName - The name of the action to query
 * @param honeycombBaseUrl - The base URL for the Honeycomb dataset
 * @returns The complete Honeycomb query URL
 */
export const generateHoneycombUrl = (
  actionName: string,
  honeycombBaseUrl: string,
): string => {
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
  return `${honeycombBaseUrl}?query=${queryString}`;
};

/**
 * Generates a Honeycomb URL for a specific identifier
 * @param identifier - The identifier to query
 * @param honeycombBaseUrl - The base URL for the Honeycomb dataset
 * @returns The complete Honeycomb query URL
 */
export const generateHoneycombIdentifierUrl = (
  identifier: string,
  honeycombBaseUrl: string,
): string => {
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
  return `${honeycombBaseUrl}?query=${queryString}`;
};

/**
 * Generates a GitHub search URL for a specific action name
 * @param actionName - The action name to search for
 * @param githubOwner - The GitHub repository owner
 * @param githubRepo - The GitHub repository name
 * @returns The complete GitHub search URL
 */
export const generateGitHubSearchUrl = (
  actionName: string,
  githubOwner: string,
  githubRepo: string,
): string => {
  const searchQuery = encodeURIComponent(`"${actionName}"`);
  return `https://github.com/${githubOwner}/${githubRepo}/search?q=${searchQuery}&type=code`;
};

/**
 * Generates a GitHub file URL for a specific file path
 * @param filePath - The absolute file path
 * @param githubOwner - The GitHub repository owner
 * @param githubRepo - The GitHub repository name
 * @param githubBranch - The GitHub branch name
 * @returns The complete GitHub file URL
 */
export const generateGitHubFileUrl = (
  filePath: string,
  githubOwner: string,
  githubRepo: string,
  githubBranch: string,
): string => {
  // Find project root by looking for .git directory
  let currentDir = path.dirname(filePath);
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, ".git"))) {
      const relativePath = path.relative(currentDir, filePath);
      return `https://github.com/${githubOwner}/${githubRepo}/blob/${githubBranch}/${relativePath.replace(/\\/g, "/")}`;
    }
    currentDir = path.dirname(currentDir);
  }
  // Fallback: use file path as-is (shouldn't happen in normal usage)
  const relativePath = path.relative(process.cwd(), filePath);
  return `https://github.com/${githubOwner}/${githubRepo}/blob/${githubBranch}/${relativePath.replace(/\\/g, "/")}`;
};

