import { DistroSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.General;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const {
    adminOnly,
    aliases,
    costData,
    disabled,
    disableShallowClone,
    imageId,
    isCluster,
    name,
    note,
    singleTaskDistro,
    warningNote,
  } = data;

  return {
    costData: {
      onDemandRate: costData?.onDemandRate ?? 0,
      savingsPlanRate: costData?.savingsPlanRate ?? 0,
    },
    distroAliases: {
      aliases,
    },
    distroImage: {
      image: imageId,
    },
    distroName: {
      name,
    },
    distroOptions: {
      adminOnly,
      disabled,
      disableShallowClone,
      isCluster,
      note,
      singleTaskDistro,
      warningNote,
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { distroAliases, distroImage, distroName, distroOptions },
  distro,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
) => ({
  ...distro,
  adminOnly: distroOptions.adminOnly,
  aliases: distroAliases.aliases,
  disabled: distroOptions.disabled,
  disableShallowClone: distroOptions.disableShallowClone,
  imageId: distroImage.image,
  isCluster: distroOptions.isCluster,
  name: distroName.name,
  note: distroOptions.note,
  singleTaskDistro: distroOptions.singleTaskDistro,
  ...(distroOptions.singleTaskDistro && {
    isVirtualWorkStation: false,
    userSpawnAllowed: false,
  }),
  warningNote: distroOptions.warningNote,
})) satisfies FormToGqlFunction<Tab>;
