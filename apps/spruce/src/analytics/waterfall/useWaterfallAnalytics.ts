import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { FilterType } from "components/TupleSelectWithRegexConditional";
import { slugs } from "constants/routes";

type Action =
  | {
      name: "Clicked commit label";
      link: "jira" | "githash" | "upstream project";
      "commit.type": "active" | "inactive";
    }
  | { name: "Clicked variant label" }
  | { name: "Clicked task box"; "task.status": string }
  | { name: "Clicked jump to most recent commit button" }
  | {
      name: "Clicked pin build variant";
      action: "pinned" | "unpinned";
      variant: string;
    }
  | { name: "Changed project"; project: string }
  | { name: "Filtered by build variant"; type: FilterType }
  | { name: "Filtered by requester"; requesters: string[] }
  | { name: "Filtered by git commit" }
  | { name: "Filtered by task"; type: FilterType }
  | { name: "Filtered by task status"; statuses: string[] }
  | { name: "Filtered by date" }
  | { name: "Changed page"; direction: "next" | "previous" }
  | { name: "Deleted one filter chip" }
  | { name: "Deleted all filter chips" }
  | { name: "Toggled task icon legend"; open: boolean }
  | {
      name: "Viewed waterfall beta modal";
      "beta_features.spruce_waterfall_enabled": boolean;
    };

export const useWaterfallAnalytics = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Waterfall", {
    "project.identifier": projectIdentifier || "",
  });
};
