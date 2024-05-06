import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Filter Job Logs"; filterBy: string }
  | { name: "Clicked HTML testlog url"; testId: string }
  | {
      name: "Clicked complete logs link";
      buildId?: string;
      taskId?: string;
      execution?: number;
      groupID?: string;
    }
  | { name: "Clicked Parsley test log link"; buildId?: string };

export const useJobLogsAnalytics = (isLogkeeper: boolean) =>
  useAnalyticsRoot<Action>("JobLogs", {
    isLogkeeperHostedLog: isLogkeeper,
  });
