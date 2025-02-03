import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { FilterType } from "components/TupleSelectWithRegexConditional";
import { ProjectHealthView } from "gql/generated/types";

// The comments below are used to indicate which pageType the action is relevant to (e.g. "Commit chart")
type pageType =
  | "Commit chart"
  | "Task history"
  | "Variant history"
  | "Waterfall";
type Action =
  | { name: "Changed page"; direction: "previous" | "next" } // "Commit chart"
  | { name: "Changed project"; project: string } // "Commit chart"
  | { name: "Clicked column header" } // "Task history" | "Variant history"
  | { name: "Clicked task cell"; "task.status": string } // "Task history" | "Variant history"
  | {
      name: "Clicked commit label";
      link: "jira" | "githash" | "upstream project";
      "commit.type": "active" | "inactive";
    } // "Task history" | "Variant history" | "Commit chart" | "Waterfall"
  | { name: "Clicked grouped task status badge"; statuses: string[] }
  | { name: "Clicked task status icon"; status: string } // "Commit chart"
  | { name: "Clicked variant label" } // "Commit chart"
  | {
      name: "Created notification";
      "subscription.type": string;
      "subscription.trigger": string;
    } // "Commit chart"
  | { name: "Deleted a badge" } // "Variant history" | "Task history" | "Commit chart"
  | { name: "Deleted all badges" } // "Variant history" | "Task history" | "Commit chart"
  | { name: "Filtered by build variant"; type?: FilterType } // "Variant history" | "Task history" | "Commit chart"
  | { name: "Filtered by requester"; requesters: string[] } // "Commit chart"
  | { name: "Filtered by task"; type?: FilterType } // "Commit chart"
  | { name: "Filtered by task status"; statuses: string[] } // "Commit chart"
  | { name: "Filtered failed tests" } // "Variant history" | "Task history"
  | { name: "Filtered for git commit"; commit: string } // "Commit chart"
  | {
      name: "Redirected to project identifier";
      "project.id": string;
      "project.identifier": string;
    } // "Commit chart"
  | { name: "Toggled chart view option"; "view.option": string } // "Commit chart"
  | { name: "Toggled folded commit"; toggle: "open" | "close" } // "Variant history" | "Task history"
  | { name: "Toggled icon view mode"; "icon.view": ProjectHealthView } // "Commit chart"
  | { name: "Toggled task icon legend"; open: boolean } // "Task history" | "Variant history" | "Commit chart"
  | { name: "Viewed commit chart label tooltip" } // "Commit chart"
  | { name: "Viewed git commit search modal" } // "Commit chart"
  | { name: "Viewed hidden commits modal" } // "Commit chart"
  | { name: "Viewed notification modal" } // "Commit chart"
  | { name: "Viewed project health page" } // "Commit chart"
  | { name: "Viewed variant history page" } // "Commit chart"
  | { name: "Viewed task history page" }; // "Commit chart"

export const useProjectHealthAnalytics = (p: { page: pageType }) =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("ProjectHealthPages", {
    page: p.page,
  });
