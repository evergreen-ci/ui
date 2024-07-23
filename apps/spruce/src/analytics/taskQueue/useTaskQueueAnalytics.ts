import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Changed distro"; distro: string }
  | { name: "Clicked task link" }
  | { name: "Clicked version link" }
  | { name: "Clicked project link" }
  | { name: "Clicked activated by link" };

export const useTaskQueueAnalytics = () =>
  useAnalyticsRoot<Action>("TaskQueue");
