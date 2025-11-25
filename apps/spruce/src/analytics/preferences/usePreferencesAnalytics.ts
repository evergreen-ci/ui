import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Changed tab"; tab: string }
  | { name: "Saved profile info" }
  | {
      name: "Saved beta feature settings";
    }
  | { name: "Saved notification preferences" }
  | { name: "Deleted subscriptions" }
  | { name: "Clicked CLI download link"; "download.name": string }
  | { name: "Clicked download auth file" }
  | { name: "Clicked reset API key" }
  | { name: "Created new public key" }
  | { name: "Changed public key" }
  | { name: "Deleted public key" }
  | { name: "Toggled polling"; enabled: boolean }
  | { name: "Toggled task review"; enabled: boolean };

export const usePreferencesAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("PreferencesPages");
