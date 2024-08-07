import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsObject } from "analytics/types";

type Action = {
  name: "Clicked link";
  link: "myPatches" | "patch" | "version" | "waterfall" | "displayTask";
};

export const useBreadcrumbAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsObject>("Breadcrumb");
