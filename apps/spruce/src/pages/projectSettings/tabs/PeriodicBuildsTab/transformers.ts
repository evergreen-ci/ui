import { ProjectSettingsTabRoutes } from "constants/routes";
import { PeriodicBuild } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";
import { IntervalSpecifier } from "./types";

type Tab = ProjectSettingsTabRoutes.PeriodicBuilds;

const getTitle = (
  definition: Pick<PeriodicBuild, "cron" | "intervalHours" | "message">,
) => {
  if (!definition) {
    return "";
  }
  const { cron, intervalHours, message } = definition;
  if (message) {
    return message;
  }
  return intervalHours ? `Every ${intervalHours} hours` : cron;
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const gqlToForm = ((data, { projectType }) => {
  if (!data) return null;

  const {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    projectRef: { periodicBuilds },
  } = data;

  return {
    periodicBuildsOverride:
      projectType !== ProjectType.AttachedProject || !!periodicBuilds,
    periodicBuilds:
      periodicBuilds?.map(
        ({
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          alias,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          configFile,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          cron,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          id,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          intervalHours,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          message,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          nextRunTime,
        }) => ({
          alias,
          configFile,
          id,
          message,
          nextRunTime: nextRunTime.toString(),
          displayTitle: getTitle({ cron, intervalHours, message }),
          interval:
            cron === ""
              ? {
                  specifier: IntervalSpecifier.Hours,
                  cron: "",
                  intervalHours,
                }
              : {
                  specifier: IntervalSpecifier.Cron,
                  intervalHours: null,
                  cron,
                },
        }),
      ) ?? [],
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { periodicBuilds, periodicBuildsOverride },
  isRepo,
  id,
) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    id,
    periodicBuilds: periodicBuildsOverride
      ? periodicBuilds.map(
          ({
            alias,
            configFile,
            id: periodicBuildId,
            interval,
            message,
            nextRunTime,
          }) => ({
            alias,
            configFile,
            id: periodicBuildId || "",
            message,
            nextRunTime: new Date(nextRunTime),
            ...(interval.specifier === IntervalSpecifier.Cron
              ? {
                  cron: interval.cron,
                  intervalHours: 0,
                }
              : {
                  cron: "",
                  intervalHours: interval.intervalHours,
                }),
          }),
        )
      : null,
  },
})) satisfies FormToGqlFunction<Tab>;
