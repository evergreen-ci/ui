import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { FilterLogic, WordWrapFormat } from "constants/enums";

type Action =
  | { name: "Opened task link" }
  | { name: "Opened job logs" }
  | { name: "Opened raw logs" }
  | { name: "Opened HTML logs" }
  | { name: "Clicked copy to Jira" }
  | { name: "Toggled wrap"; on: boolean }
  | { name: "Toggled word wrap format"; format: WordWrapFormat }
  | { name: "Toggled case sensitivity"; on: boolean }
  | { name: "Toggled pretty print"; on: boolean }
  | { name: "Toggled filter logic"; logic: FilterLogic }
  | { name: "Toggled expandable rows"; on: boolean }
  | { name: "Toggled zebra stripes"; on: boolean }
  | { name: "Toggled jump to failing line"; on: boolean }
  | { name: "Toggled highlight filters"; on: boolean }
  | { name: "Toggled sections"; on: boolean };

export const usePreferencesAnalytics = () =>
  useAnalyticsRoot<Action>("Preferences");
