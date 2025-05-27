import { AdminSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = AdminSettingsTabRoutes.FeatureFlags;

export const gqlToForm = ((data) => {
  if (!data)
    return {
      featureFlags: {
        services: false,
        notifications: false,
        features: false,
        batchJobs: false,
        disabledGqlQueries: false,
      },
    };
  return {
    featureFlags: {
      services: false,
      notifications: false,
      features: false,
      batchJobs: false,
      disabledGqlQueries: false,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (() => ({})) satisfies FormToGqlFunction<Tab>;
