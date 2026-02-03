import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Changed distro"; distro: string }
  | { name: "Clicked task link" }
  | { name: "Clicked version link" }
  | { name: "Clicked project link" }
  | { name: "Clicked activated by link" };

export const useTaskQueueAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("TaskQueue");
