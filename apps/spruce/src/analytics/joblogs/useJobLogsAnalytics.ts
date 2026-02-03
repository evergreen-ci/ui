import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | {
      name: "Clicked complete logs link";
      "build.id"?: string;
      "task.id"?: string;
      execution?: number;
      "group.id"?: string;
    }
  | { name: "Clicked Parsley test log link"; "build.id"?: string };

export const useJobLogsAnalytics = (isLogkeeper: boolean) =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("JobLogs", {
    isLogkeeperHostedLog: isLogkeeper,
  });
