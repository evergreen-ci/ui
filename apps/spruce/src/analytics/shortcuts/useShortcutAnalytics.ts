import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsObject } from "analytics/types";

type Action = { name: "Used Shortcut"; keys: string };

export const useShortcutAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsObject>("Shortcut");
