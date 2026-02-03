import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Filtered hosts table"; "filter.by": string | string[] }
  | { name: "Sorted hosts table" }
  | { name: "Changed page size"; "page.size": number }
  | { name: "Clicked restart jasper button" }
  | { name: "Clicked reprovision host button" }
  | { name: "Clicked update host status button"; "host.status": string };

export const useHostsTableAnalytics = (isHostPage?: boolean) =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>(
    isHostPage ? "HostPage" : "AllHostsPage",
  );
