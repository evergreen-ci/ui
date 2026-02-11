import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { FilterType } from "components/TupleSelectWithRegexConditional";
import { slugs } from "constants/routes";

type Action =
  | { name: "Changed page"; direction: "next" | "previous" }
  | { name: "Changed project"; project: string }
  | {
      name: "Clicked commit label";
      link: "jira" | "githash" | "upstream project";
      "commit.type": "active" | "inactive";
    }
  | { name: "Clicked variant label" }
  | { name: "Clicked task box"; "task.status": string }
  | { name: "Clicked jump to most recent commit button" }
  | { name: "Clicked clear all filters button" }
  | {
      name: "Clicked pin build variant";
      action: "pinned" | "unpinned";
      variant: string;
    }
  | {
      name: "Created notification";
      "subscription.type": string;
      "subscription.trigger": string;
    }
  | { name: "Deleted all filter chips" }
  | { name: "Deleted one filter chip" }
  | { name: "Filtered by build variant"; "filter.type": FilterType }
  | { name: "Filtered by requester"; requesters: string[] }
  | { name: "Filtered by git commit" }
  | { name: "Filtered by task"; "filter.type": FilterType }
  | { name: "Filtered by task status"; statuses: string[] }
  | { name: "Filtered by date" }
  | { name: "Toggled task icon legend"; open: boolean }
  | {
      name: "Viewed waterfall modal";
      navigated_to_waterfall: boolean;
    }
  | { name: "Redirected to waterfall page"; referrer: string }
  | { name: "Clicked task overview popup"; "task.id": string; open: boolean };

export const useWaterfallAnalytics = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Waterfall", {
    "project.identifier": projectIdentifier || "",
  });
};
