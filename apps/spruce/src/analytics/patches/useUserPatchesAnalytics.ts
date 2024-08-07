import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsObject } from "analytics/types";

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
  useAnalyticsRoot<Action, AnalyticsObject>("UserPatches");
