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
  | { name: "Filtered by requester"; requesters: string[] };

export const useWaterfallAnalytics = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Waterfall", {
    "project.identifier": projectIdentifier || "",
  });
};
