import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Filtered hosts table"; filterBy: string | string[] }
  | { name: "Sorted hosts table" }
  | { name: "Changed page size"; pageSize: number }
  | { name: "Clicked restart jasper button" }
  | { name: "Clicked reprovision host button" }
  | { name: "Clicked update host status button"; status: string };

export const useHostsTableAnalytics = (isHostPage?: boolean) =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>(
    isHostPage ? "HostPage" : "AllHostsPage",
  );
