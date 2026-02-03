import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";

type Action = { name: "Used 2024 Boilerplate!" };

export const useAprilFoolsAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("April Fools");
