import { ProjectSettingsTabRoutes } from "constants/routes";
import { string } from "utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";

const { omitTypename } = string;

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
    gitClone,
    commands: {
      setupCommandsOverride:
        projectType !== ProjectType.AttachedProject || !!setupCommands,
      setupCommands: setupCommands?.map(omitTypename) ?? [],
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { commands: { setupCommands, setupCommandsOverride }, gitClone },
  isRepo,
  id,
) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    id,
    workstationConfig: {
      gitClone,
      setupCommands: setupCommandsOverride ? setupCommands : null,
    },
  },
})) satisfies FormToGqlFunction<Tab>;
