import {
  MyPublicKeysQuery,
  SpawnTaskQuery,
  SpawnHostMutationVariables,
} from "gql/generated/types";
import { stripNewLines } from "utils/string";
import { getSleepSchedule } from "../utils";
import { DEFAULT_VOLUME_SIZE } from "./constants";
import { FormState } from "./types";
import { validateTask } from "./utils";

interface Props {
  isVirtualWorkStation: boolean;
  formData: FormState;
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  spawnTaskData?: SpawnTaskQuery["task"];
  migrateVolumeId?: string;
}
export const formToGql = ({
  formData,
  isVirtualWorkStation,
  migrateVolumeId,
  myPublicKeys,
  spawnTaskData,
}: Props): SpawnHostMutationVariables["spawnHostInput"] => {
  const {
    expirationDetails,
    homeVolumeDetails,
    loadData,
    publicKeySection,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    requiredSection: { distro, region },
    setupScriptSection,
    userdataScriptSection,
  } = formData || {};
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { hostUptime } = expirationDetails;
  return {
    isVirtualWorkStation,
    userDataScript: userdataScriptSection?.runUserdataScript
      ? userdataScriptSection.userdataScript
      : null,
    expiration: expirationDetails?.noExpiration
      ? null
      : // @ts-expect-error: FIXME. This comment was added by an automated script.
        new Date(expirationDetails?.expiration),
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    noExpiration: expirationDetails?.noExpiration,
    sleepSchedule:
      expirationDetails?.noExpiration && hostUptime
        ? getSleepSchedule(hostUptime)
        : null,
    volumeId:
      migrateVolumeId ||
      (isVirtualWorkStation && homeVolumeDetails?.selectExistingVolume
        ? homeVolumeDetails.volumeSelect
        : null),
    homeVolumeSize:
      !migrateVolumeId &&
      isVirtualWorkStation &&
      (!homeVolumeDetails?.selectExistingVolume ||
        !homeVolumeDetails?.volumeSelect)
        ? // @ts-expect-error: FIXME. This comment was added by an automated script.
          homeVolumeDetails.volumeSize || DEFAULT_VOLUME_SIZE
        : null,
    publicKey: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      name: publicKeySection?.useExisting
        ? publicKeySection?.publicKeyNameDropdown
        : (publicKeySection?.newPublicKeyName ?? ""),
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      key: publicKeySection?.useExisting
        ? myPublicKeys.find(
            ({ name }) => name === publicKeySection?.publicKeyNameDropdown,
          )?.key
        : // @ts-expect-error: FIXME. This comment was added by an automated script.
          stripNewLines(publicKeySection.newPublicKey),
    },
    savePublicKey:
      !publicKeySection?.useExisting && !!publicKeySection?.savePublicKey,
    distroId: distro,
    region,
    taskId:
      loadData?.loadDataOntoHostAtStartup && validateTask(spawnTaskData)
        ? // @ts-expect-error: FIXME. This comment was added by an automated script.
          spawnTaskData.id
        : null,
    useProjectSetupScript: !!(
      loadData?.loadDataOntoHostAtStartup &&
      loadData?.runProjectSpecificSetupScript
    ),
    setUpScript: setupScriptSection?.defineSetupScriptCheckbox
      ? setupScriptSection?.setupScript
      : null,
    spawnHostsStartedByTask: !!(
      loadData?.loadDataOntoHostAtStartup && loadData?.startHosts
    ),
  };
};
