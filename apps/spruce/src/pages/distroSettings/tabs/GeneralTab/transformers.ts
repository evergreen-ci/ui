import { DistroSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.General;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const {
    adminOnly,
    aliases,
    disableShallowClone,
    disabled,
    isCluster,
    name,
    note,
    warningNote,
  } = data;

  return {
    distroName: {
      identifier: name,
    },
    distroAliases: {
      aliases,
    },
    distroOptions: {
      adminOnly,
      isCluster,
      disableShallowClone,
      disabled,
      note,
      warningNote,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { distroAliases, distroName, distroOptions },
  distro,
) => ({
  ...distro,
  name: distroName.identifier,
  adminOnly: distroOptions.adminOnly,
  aliases: distroAliases.aliases,
  note: distroOptions.note,
  warningNote: distroOptions.warningNote,
  isCluster: distroOptions.isCluster,
  disableShallowClone: distroOptions.disableShallowClone,
  disabled: distroOptions.disabled,
})) satisfies FormToGqlFunction<Tab>;
