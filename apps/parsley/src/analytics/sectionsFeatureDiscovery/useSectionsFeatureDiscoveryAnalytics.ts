import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | {
      name: "Clicked sections feature modal cancel button";
      release: "prod";
    }
  | { name: "Clicked feature modal confirm button"; release: "prod" };

export const useSectionsFeatureDiscoveryAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("SectionsFeatureDiscovery");
