import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action = {
  name:
    | "Used 2025 Boilerplate!"
    | "Clicked disable April Fools link"
    | "Clicked enable April Fools link in navbar";
};

export const useAprilFoolsAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("April Fools");
