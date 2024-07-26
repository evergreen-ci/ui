import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action = {
  name: "Clicked link";
  link: "myPatches" | "patch" | "version" | "waterfall" | "displayTask";
};

export const useBreadcrumbAnalytics = () =>
  useAnalyticsRoot<Action>("Breadcrumb");
