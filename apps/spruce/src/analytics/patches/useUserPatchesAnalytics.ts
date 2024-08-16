import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Changed page size" }
  | { name: "Clicked patch link" }
  | {
      name: "Filtered for patches";
      "filter.by": string;
      "filter.include.hidden": boolean;
      "filter.include.commit.queue": boolean;
    };

export const useUserPatchesAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("UserPatches");
