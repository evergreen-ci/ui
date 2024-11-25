import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { slugs } from "constants/routes";

type Action =
  | {
      name: "Clicked commit label";
      link: "jira" | "githash" | "upstream project";
      "commit.type": "active" | "inactive";
    }
  | { name: "Clicked variant label" }
  | { name: "Clicked task box"; "task.status": string }
  | { name: "Changed project"; project: string }
  | { name: "Filtered by requester"; requesters: string[] }
  | { name: "Filtered by date" }
  | { name: "Changed page"; direction: "next" | "previous" }
  | { name: "Created build variant filter" }
  | { name: "Created task filter" }
  | { name: "Deleted one filter badge" }
  | { name: "Deleted all filter badges" }
  | { name: "Toggled task icon legend"; open: boolean };

export const useWaterfallAnalytics = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Waterfall", {
    "project.identifier": projectIdentifier || "",
  });
};
