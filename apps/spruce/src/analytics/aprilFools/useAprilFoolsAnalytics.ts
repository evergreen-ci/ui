import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action = { name: "Used 2024 Boilerplate!" };

export const useAprilFoolsAnalytics = () =>
  useAnalyticsRoot<Action>("April Fools");
