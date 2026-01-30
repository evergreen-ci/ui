import { defaultEC2Region } from "constants/hosts";
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
}: Props): NonNullable<SpawnHostMutationVariables["spawnHostInput"]> => {
  const {
    expirationDetails,
    homeVolumeDetails,
    isDebug,
    loadData,
    publicKeySection,
    requiredSection,
    setupScriptSection,
    userdataScriptSection,
  } = formData || {};

  const { distro = "", region = defaultEC2Region } = requiredSection ?? {};
  const { defineSetupScriptCheckbox, setupScript } = setupScriptSection ?? {};
  const { runUserdataScript, userdataScript } = userdataScriptSection ?? {};

  const {
    loadDataOntoHostAtStartup,
    runProjectSpecificSetupScript,
    startHosts,
    useOAuth,
  } = loadData ?? {};

  const defaultExpiration = new Date();
  defaultExpiration.setDate(defaultExpiration.getDate() + 7);

  const {
    expiration = defaultExpiration,
    hostUptime,
    noExpiration = false,
  } = expirationDetails ?? {};

  const {
    selectExistingVolume,
    volumeSelect,
    volumeSize = DEFAULT_VOLUME_SIZE,
  } = homeVolumeDetails ?? {};

  const {
    newPublicKey = "",
    newPublicKeyName = "",
    publicKeyNameDropdown = "",
    savePublicKey = false,
    useExisting = false,
  } = publicKeySection ?? {};

  return {
    isVirtualWorkStation,
    ...(isDebug ? { isDebug: true } : {}),
    userDataScript: runUserdataScript ? userdataScript : null,
    expiration: noExpiration ? null : new Date(expiration),
    noExpiration: noExpiration,
    sleepSchedule:
      noExpiration && hostUptime ? getSleepSchedule(hostUptime) : null,
    volumeId:
      migrateVolumeId ||
      (isVirtualWorkStation && selectExistingVolume ? volumeSelect : null),
    homeVolumeSize:
      !migrateVolumeId &&
      isVirtualWorkStation &&
      (!selectExistingVolume || !volumeSelect)
        ? volumeSize
        : null,
    publicKey: {
      name: useExisting ? publicKeyNameDropdown : newPublicKeyName,
      key: useExisting
        ? (myPublicKeys.find(({ name }) => name === publicKeyNameDropdown)
            ?.key ?? "")
        : stripNewLines(newPublicKey),
    },
    savePublicKey: !useExisting && !!savePublicKey,
    distroId: distro,
    region,
    taskId:
      loadDataOntoHostAtStartup && validateTask(spawnTaskData)
        ? spawnTaskData?.id
        : null,
    useOAuth: !!(loadDataOntoHostAtStartup && useOAuth),
    useProjectSetupScript: !!(
      loadDataOntoHostAtStartup && runProjectSpecificSetupScript
    ),
    setUpScript: defineSetupScriptCheckbox ? setupScript : null,
    spawnHostsStartedByTask: !!(loadDataOntoHostAtStartup && startHosts),
  };
};
