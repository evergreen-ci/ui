import { DistroSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.Task;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { dispatcherSettings, finderSettings, plannerSettings } = data;
  const { version: plannerVersion, ...rest } = plannerSettings;

  return {
    dispatcherSettings,
    finderSettings,
    plannerSettings: {
      tunableOptions: rest,
      version: plannerVersion,
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { dispatcherSettings, finderSettings, plannerSettings },
  distro,
) => {
  const { tunableOptions, version: plannerVersion } = plannerSettings;

  return {
    ...distro,
    dispatcherSettings,
    finderSettings,
    plannerSettings: {
      version: plannerVersion,
      ...tunableOptions,
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
