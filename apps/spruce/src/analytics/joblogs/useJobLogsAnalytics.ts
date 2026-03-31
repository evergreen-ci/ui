import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | {
      name: "Clicked complete logs link";
      "task.id"?: string;
      execution?: number;
      "group.id"?: string;
    }
  | { name: "Clicked Parsley test log link" };

export const useJobLogsAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("JobLogs");
