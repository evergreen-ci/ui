import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { slugs } from "constants/routes";

type Action =
  | { name: "Changed page size" }
  | { name: "Changed project"; "project.identifier": string }
  | { name: "Clicked patch link" }
  | {
      name: "Filtered for patches";
      "filter.by": string;
      "filter.include.hidden": boolean;
      "filter.include.commit.queue": boolean;
    };

export const useProjectPatchesAnalytics = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return useAnalyticsRoot<Action, AnalyticsIdentifier>("ProjectPatches", {
    "project.identifier": projectIdentifier || "",
  });
};
