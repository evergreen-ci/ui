import { DistroSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.Task;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { dispatcherSettings, finderSettings, plannerSettings } = data;
  const {
    mergeQueueTargetTime,
    targetTime,
    version: plannerVersion,
    ...tunableOptions
  } = plannerSettings;

  return {
    finderSettings,
    plannerSettings: {
      version: plannerVersion,
      tunableOptions: {
        ...tunableOptions,
        targetTimeNanoseconds: targetTime * 1_000_000,
        mergeQueueTargetTimeNanoseconds: mergeQueueTargetTime * 1_000_000,
      },
    },
    dispatcherSettings,
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { dispatcherSettings, finderSettings, plannerSettings },
  distro,
) => {
  const { tunableOptions, version: plannerVersion } = plannerSettings;
  const {
    mergeQueueTargetTimeNanoseconds,
    targetTimeNanoseconds,
    ...plannerSettingsRest
  } = tunableOptions;

  return {
    ...distro,
    finderSettings,
    plannerSettings: {
      version: plannerVersion,
      ...plannerSettingsRest,
      targetTime: targetTimeNanoseconds / 1_000_000,
      mergeQueueTargetTime: mergeQueueTargetTimeNanoseconds / 1_000_000,
    },
    dispatcherSettings,
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
