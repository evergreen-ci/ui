import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Filtered hosts table"; filterBy: string | string[] }
  | { name: "Sorted hosts table" }
  | { name: "Changed page size"; pageSize: number }
  | { name: "Clicked restart jasper" }
  | { name: "Clicked reprovision host" }
  | { name: "Clicked update host status"; status: string };

export const useHostsTableAnalytics = (isHostPage?: boolean) =>
  useAnalyticsRoot<Action>(isHostPage ? "HostPage" : "HostsTable");
