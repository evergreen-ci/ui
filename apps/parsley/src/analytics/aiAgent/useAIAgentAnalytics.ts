import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action = {
  name: "Viewed Parsley AI beta modal";
  "beta_features.parsley_ai_enabled": boolean;
};

export const useAIAgentAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("AIAgent");
