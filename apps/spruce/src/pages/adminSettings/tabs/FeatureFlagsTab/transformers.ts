import { AdminSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = AdminSettingsTabRoutes.FeatureFlags;

export const gqlToForm = ((data) => {
  if (!data) return {};
  return {};
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (() => ({})) satisfies FormToGqlFunction<Tab>;
