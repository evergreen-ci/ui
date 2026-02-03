import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";

type Action = { name: "Used shortcut"; keys: string };

export const useShortcutAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("Shortcut");
