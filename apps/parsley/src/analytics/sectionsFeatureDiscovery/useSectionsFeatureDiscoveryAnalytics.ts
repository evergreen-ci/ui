import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | {
      name: "Clicked sections feature modal cancel button";
      release: "beta";
    }
  | { name: "Clicked feature modal enable sections buttons"; release: "beta" }
  | { name: "Clicked sections toggle guide cue close button"; release: "beta" }
  | {
      name: "Clicked jump to failing line toggle guide cue close button";
      release: "beta";
    };

export const useSectionsFeatureDiscoveryAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("SectionsFeatureDiscovery");
