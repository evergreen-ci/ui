import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import {
  ProjectHealthView,
  SaveSubscriptionForUserMutationVariables,
} from "gql/generated/types";

type pageType = "Commit chart" | "Task history" | "Variant history";
type Action =
  | { name: "Changed page"; direction: "previous" | "next" } // "Commit chart"
  | { name: "Changed project"; project: string } // "Commit chart"
  | { name: "Click column header" } // "Task history" | "Variant history"
  | { name: "Click task cell"; taskStatus: string } // "Task history" | "Variant history"
  | {
      name: "Clicked commit label";
      link: "jira" | "githash" | "upstream project";
      commitType: "active" | "inactive";
    } // "Task history" | "Variant history" | "Commit chart"
  | { name: "Clicked grouped task status badge"; statuses: string[] }
  | { name: "Clicked task status icon"; status: string } // "Commit chart"
  | { name: "Click variant label" } // "Commit chart"
  | {
      name: "Created notification";
      subscription: SaveSubscriptionForUserMutationVariables["subscription"];
    } // "Commit chart"
  | { name: "Deleted a badge" } // "Variant history" | "Task history" | "Commit chart"
  | { name: "Deleted all badges" } // "Variant history" | "Task history" | "Commit chart"
  | { name: "Filter by build variant" } // "Variant history" | "Task history"
  | { name: "Filter by requester"; requesters: string[] } // "Commit chart"
  | { name: "Filter by task" } // "Commit chart"
  | { name: "Filter by task status"; statuses: string[] } // "Commit chart"
  | { name: "Filtered failed tests" } // "Variant history" | "Task history"
  | { name: "Filtered for git commit"; commit: string } // "Commit chart"
  | {
      name: "Redirected to project identifier";
      projectId: string;
      projectIdentifier: string;
    } // "Commit chart"
  | { name: "Toggled chart view option"; viewOption: string } // "Commit chart"
  | { name: "Toggled folded commit"; toggle: "open" | "close" } // "Variant history" | "Task history"
  | { name: "Toggled icon view mode"; iconView: ProjectHealthView } // "Commit chart"
  | { name: "Toggled task icon legend"; open: boolean } // "Task history" | "Variant history" | "Commit chart"
  | { name: "Viewed commit chart label tooltip" } // "Commit chart"
  | { name: "Viewed git commit search modal" } // "Commit chart"
  | { name: "Viewed hidden commits modal" } // "Commit chart"
  | { name: "Viewed notification modal" } // "Commit chart"
  | { name: "Viewed project health page" } // "Commit chart"
  | { name: "Viewed variant history page" } // "Commit chart"
  | { name: "Viewed task history page" }; // "Commit chart"

export const useProjectHealthAnalytics = (p: { page: pageType }) =>
  useAnalyticsRoot<Action>("ProjectHealthPages", { page: p.page });
