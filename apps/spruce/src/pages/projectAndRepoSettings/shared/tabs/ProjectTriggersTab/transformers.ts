import { Unpacked } from "@evg-ui/lib/types";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectTriggersSettingsFragment } from "gql/generated/types";
import { ProjectTriggerLevel } from "types/triggers";
import { omitTypename } from "utils/object";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";

type Tab = ProjectSettingsTabRoutes.ProjectTriggers;

const getTitle = ({
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  level,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  project,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  status,
}: Unpacked<ProjectTriggersSettingsFragment["triggers"]>) =>
  `${project}: On ${level}${status === "all" ? "" : ` ${status}`}`;

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const gqlToForm = ((data, { projectType }) => {
  if (!data) return null;

  const {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    projectRef: { triggers },
  } = data;

  return {
    triggersOverride: projectType !== ProjectType.AttachedProject || !!triggers,
    triggers:
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      triggers?.map((trigger) =>
        omitTypename({
          ...trigger,
          level: trigger.level as ProjectTriggerLevel,
          displayTitle: getTitle(trigger),
        }),
      ) ?? [],
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ triggers, triggersOverride }, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    id,
    triggers: triggersOverride
      ? triggers.map((trigger) => ({
          project: trigger.project,
          level: trigger.level,
          buildVariantRegex: trigger.buildVariantRegex,
          taskRegex: trigger.taskRegex,
          status: trigger.status,
          dateCutoff: trigger.dateCutoff,
          configFile: trigger.configFile,
          alias: trigger.alias,
          unscheduleDownstreamVersions: trigger.unscheduleDownstreamVersions,
        }))
      : null,
  },
})) satisfies FormToGqlFunction<Tab>;
