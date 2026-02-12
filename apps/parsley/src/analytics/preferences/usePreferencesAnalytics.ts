import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { FilterLogic, WordWrapFormat } from "constants/enums";

type Action =
  | { name: "Clicked task link" }
  | { name: "Clicked job logs link" }
  | { name: "Clicked raw logs link" }
  | { name: "Clicked HTML logs link" }
  | { name: "Clicked copy raw format button" }
  | { name: "Clicked copy to Jira format button" }
  | { name: "Toggled word wrap"; on: boolean }
  | { name: "Toggled word wrap format"; format: WordWrapFormat }
  | { name: "Toggled case sensitive search"; on: boolean }
  | { name: "Toggled pretty print"; on: boolean }
  | { name: "Toggled filter logic"; logic: FilterLogic }
  | { name: "Toggled expandable rows"; on: boolean }
  | { name: "Toggled zebra stripes"; on: boolean }
  | { name: "Toggled jump to failing line"; on: boolean }
  | { name: "Toggled highlight filters"; on: boolean }
  | { name: "Toggled sections"; on: boolean }
  | { name: "Toggled sticky headers"; on: boolean }
  | { name: "Toggled include timestamps"; on: boolean };

export const usePreferencesAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("Preferences");
