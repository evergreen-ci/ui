import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Changed distro"; distro: string }
  | { name: "Click task link" }
  | { name: "Click version link" }
  | { name: "Click project link" }
  | { name: "Click activated by link" };

export const useTaskQueueAnalytics = () =>
  useAnalyticsRoot<Action>("TaskQueue");
