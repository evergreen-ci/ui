import { ProjectSettingsTabRoutes } from "constants/routes";
import { omitTypename } from "utils/object";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";

type Tab = ProjectSettingsTabRoutes.VirtualWorkstation;

export const gqlToForm = ((data, options) => {
  if (!data) return null;

  const {
    projectRef: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      workstationConfig: { gitClone, setupCommands },
    },
  } = data;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { projectType } = options;

  return {
    commands: {
      setupCommands: setupCommands?.map(omitTypename) ?? [],
      setupCommandsOverride:
        projectType !== ProjectType.AttachedProject || !!setupCommands,
    },
    gitClone,
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { commands: { setupCommands, setupCommandsOverride }, gitClone },
  isRepo,
  id,
) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    id,
    workstationConfig: {
      gitClone,
      setupCommands: setupCommandsOverride ? setupCommands : null,
    },
  },
})) satisfies FormToGqlFunction<Tab>;
