import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Changed page size" }
  | { name: "Clicked patch link" }
  | {
      name: "Filtered for patches";
      filterBy: string;
      includeHidden: boolean;
      includeCommitQueue: boolean;
    };

export const useUserPatchesAnalytics = () =>
  useAnalyticsRoot<Action>("UserPatches");
