import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Changed page"; "page.number": number }
  | { name: "Changed page size"; "page.size": number }
  | { name: "Clicked patch link" }
  | {
      name: "Filtered for patches";
      "filter.by"?: string;
      "filter.hidden"?: boolean;
      "filter.commit_queue"?: boolean;
    };

export const useUserPatchesAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("UserPatches");
