import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Clicked admin settings link" }
  | { name: "Clicked legacy UI link" }
  | { name: "Clicked logo link" }
  | { name: "Clicked waterfall link" }
  | { name: "Clicked my patches link" }
  | { name: "Clicked my hosts link" }
  | { name: "Clicked all hosts link" }
  | { name: "Clicked distro settings link" }
  | { name: "Clicked project settings link" }
  | { name: "Clicked project patches link" }
  | { name: "Clicked commit queue link" }
  | { name: "Clicked EVG wiki link" }
  | { name: "Clicked profile link" }
  | { name: "Clicked notifications link" }
  | { name: "Clicked UI settings link" }
  | { name: "Clicked task queue link" };

export const useNavbarAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("Navbar");
