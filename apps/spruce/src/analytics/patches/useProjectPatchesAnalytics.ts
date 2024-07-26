import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { slugs } from "constants/routes";

type Action =
  | { name: "Changed page size" }
  | { name: "Changed project"; projectIdentifier: string }
  | { name: "Clicked patch link" }
  | {
      name: "Filtered for patches";
      filterBy: string;
      includeHidden: boolean;
      includeCommitQueue: boolean;
    };

export const useProjectPatchesAnalytics = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return useAnalyticsRoot<Action>("ProjectPatches", { projectIdentifier });
};
