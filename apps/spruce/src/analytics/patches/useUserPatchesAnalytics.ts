import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Changed page size" }
  | { name: "Clicked patch link" }
  | {
      name: "Filtered for patches";
      "filter.by"?: string;
      "filter.hidden"?: boolean;
      "filter.commit_queue"?: boolean;
    };

export const useUserPatchesAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("UserPatches");
