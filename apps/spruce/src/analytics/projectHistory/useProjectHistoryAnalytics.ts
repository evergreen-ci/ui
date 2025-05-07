import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { FilterType } from "components/TupleSelectWithRegexConditional";

// The comments below are used to indicate which pageType the action is relevant to (e.g. "Commit chart")
type pageType = "Task history" | "Variant history";
type Action =
  | { name: "Clicked column header" } // "Task history" | "Variant history"
  | { name: "Clicked task cell"; "task.status": string } // "Task history" | "Variant history"
  | { name: "Changed page"; direction: "previous" | "next" } // "Task history" | "Variant history"
  | {
      name: "Clicked commit label";
      link: "jira" | "githash" | "upstream project";
      "commit.type": "active" | "inactive";
    } // "Task history" | "Variant history"
  | { name: "Clicked grouped task status badge"; statuses: string[] }
  | { name: "Deleted a badge" } // "Variant history" | "Task history"
  | { name: "Deleted all badges" } // "Variant history" | "Task history"
  | { name: "Filtered by build variant"; "filter.type"?: FilterType } // "Variant history" | "Task history"
  | { name: "Filtered failed tests" } // "Variant history" | "Task history"
  | { name: "Filtered by task"; "filter.type"?: FilterType } // "Task history" | "Variant history"
  | { name: "Toggled folded commit"; toggle: "open" | "close" } // "Variant history" | "Task history"
  | { name: "Toggled task icon legend"; open: boolean }; // "Task history" | "Variant history"

/**
 * `useProjectHistoryAnalytics` is a custom hook that provides analytics tracking for project history pages.
 * This is only meant to be used temporarily until the project history pages are fully deprecated.
 * It uses the same analytics object as the old project health pages. So that we can track the same events as they are migrated over to the new pages.
 * @param p - An object containing the page type.
 * @param p.page - The type of page being viewed. This can be either "Task history" or "Variant history".
 * @returns - An object containing the analytics tracking functions.
 */
export const useProjectHistoryAnalytics = (p: { page: pageType }) =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("ProjectHealthPages", {
    page: p.page,
  });
