import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { slugs } from "constants/routes";

type Action = {
  name: "Clicked commit label";
  link: "jira" | "githash" | "upstream project";
  "commit.type": "active" | "inactive";
};

export const useWaterfallAnalytics = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Waterfall", {
    "project.identifier": projectIdentifier || "",
  });
};
