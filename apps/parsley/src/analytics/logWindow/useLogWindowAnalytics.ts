import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { DIRECTION } from "context/LogContext/types";
import { Filter } from "types/logs";

type Action =
  | { name: "Added filter"; filterExpression: string }
  | { name: "Deleted filter"; filterExpression: string }
  | { name: "Toggled filter"; open: boolean }
  | { name: "Applied project filters"; filters: Filter[] }
  | { name: "Added bookmark" }
  | { name: "Added share line" }
  | { name: "Removed share line" }
  | { name: "Navigated with bookmark" }
  | { name: "Removed bookmark" }
  | { name: "Cleared all bookmarks" }
  | { name: "Opened share menu" }
  | { name: "Closed share menu" }
  | { name: "Copied share link" }
  | { name: "Copied share lines to clipboard" }
  | { name: "Applied range limit" }
  | { name: "Edited filter"; before: Filter; after: Filter }
  | { name: "Added highlight"; highlightExpression: string }
  | { name: "Removed highlight"; highlightExpression: string }
  | { name: "Applied search"; searchExpression: string }
  | { name: "Applied search suggestion"; suggestion: string }
  | { name: "Expanded lines"; option: "All" | "Five"; lineCount: number }
  | { name: "Collapsed lines" }
  | { name: "Paginated through search results"; direction: DIRECTION }
  | {
      name: "Toggled section";
      sectionName: string;
      sectionType: "command" | "function";
      open: boolean;
    };

export const useLogWindowAnalytics = () =>
  useAnalyticsRoot<Action>("LogWindow");
