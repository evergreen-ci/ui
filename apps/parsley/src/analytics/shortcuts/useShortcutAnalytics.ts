import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action = { name: "Used shortcut"; keys: string };

export const useShortcutAnalytics = () => useAnalyticsRoot<Action>("Shortcut");
