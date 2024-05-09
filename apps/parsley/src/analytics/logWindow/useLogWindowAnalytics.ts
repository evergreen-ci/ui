import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { DIRECTION } from "context/LogContext/types";
import { Filter } from "types/logs";

type Action =
  | { name: "Added Filter"; filterExpression: string }
  | { name: "Deleted Filter"; filterExpression: string }
  | { name: "Toggled Filter"; open: boolean }
  | { name: "Applied Project Filters"; filters: Filter[] }
  | { name: "Added Bookmark" }
  | { name: "Added Share line" }
  | { name: "Removed Share line" }
  | { name: "Navigated With Bookmark" }
  | { name: "Removed Bookmark" }
  | { name: "Cleared All Bookmarks" }
  | { name: "Opened Share Menu" }
  | { name: "Closed Share Menu" }
  | { name: "Copied Share Link" }
  | { name: "Copied Share Lines To Clipboard" }
  | { name: "Applied Range Limit" }
  | { name: "Edited Filter"; before: Filter; after: Filter }
  | { name: "Added Highlight"; highlightExpression: string }
  | { name: "Removed Highlight"; highlightExpression: string }
  | { name: "Applied Search"; searchExpression: string }
  | { name: "Applied Search Suggestion"; suggestion: string }
  | { name: "Expanded Lines"; option: "All" | "Five"; lineCount: number }
  | { name: "Collapsed Lines" }
  | { name: "Paginated Through Search Results"; direction: DIRECTION }
  | { name: "Focused Section"; functionName: string }
  | { name: "Opened Section"; functionName: string };

export const useLogWindowAnalytics = () =>
  useAnalyticsRoot<Action>("LogWindow");
