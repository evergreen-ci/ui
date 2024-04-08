import {
  MyPublicKeysQuery,
  SpawnTaskQuery,
  SpawnHostMutationVariables,
} from "gql/generated/types";
import { stripNewLines } from "utils/string";
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
    distro,
    expirationDetails,
    homeVolumeDetails,
    loadData,
    publicKeySection,
    region,
    setupScriptSection,
    userdataScriptSection,
  } = formData || {};
  return {
    isVirtualWorkStation,
    userDataScript: userdataScriptSection?.runUserdataScript
      ? userdataScriptSection.userdataScript
      : null,
    expiration: expirationDetails?.noExpiration
      ? null
      : new Date(expirationDetails?.expiration),
    noExpiration: expirationDetails?.noExpiration,
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
        ? homeVolumeDetails.volumeSize || DEFAULT_VOLUME_SIZE
        : null,
    publicKey: {
      name: publicKeySection?.useExisting
        ? publicKeySection?.publicKeyNameDropdown
        : publicKeySection?.newPublicKeyName ?? "",
      key: publicKeySection?.useExisting
        ? myPublicKeys.find(
            ({ name }) => name === publicKeySection?.publicKeyNameDropdown,
          )?.key
        : stripNewLines(publicKeySection.newPublicKey),
    },
    savePublicKey:
      !publicKeySection?.useExisting && !!publicKeySection?.savePublicKey,
    distroId: distro,
    region,
    taskId:
      loadData?.loadDataOntoHostAtStartup && validateTask(spawnTaskData)
        ? spawnTaskData.id
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
    taskSync: !!(loadData?.loadDataOntoHostAtStartup && loadData?.taskSync),
  };
};
