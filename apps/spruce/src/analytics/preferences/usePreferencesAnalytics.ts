import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { UpdateUserSettingsMutationVariables } from "gql/generated/types";

type Action =
  | { name: "Changed tab"; tab: string }
  | { name: "Saved profile info"; params: UpdateUserSettingsMutationVariables }
  | { name: "Saved notifications"; params: UpdateUserSettingsMutationVariables }
  | { name: "Deleted subscriptions" }
  | { name: "Clicked CLI download link"; downloadName: string }
  | { name: "Clicked download auth file" }
  | { name: "Clicked reset API key" }
  | { name: "Created new public key" }
  | { name: "Changed public key" }
  | { name: "Deleted public key" }
  | { name: "Toggled spruce"; value: "Enabled" | "Disabled" }
  | { name: "Toggled polling"; value: "Enabled" | "Disabled" };

export const usePreferencesAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("PreferencesPages");
