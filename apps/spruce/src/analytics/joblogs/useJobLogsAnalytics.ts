import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | {
      name: "Clicked complete logs link";
      buildId?: string;
      taskId?: string;
      execution?: number;
      groupID?: string;
    }
  | { name: "Clicked Parsley test log link"; buildId?: string };

export const useJobLogsAnalytics = (isLogkeeper: boolean) =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("JobLogs", {
    isLogkeeperHostedLog: isLogkeeper,
  });
