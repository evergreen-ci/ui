import { defaultEC2Region } from "constants/hosts";
import {
  MyPublicKeysQuery,
  SpawnHostMutationVariables,
  SpawnTaskQuery,
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
    debugSection,
    expirationDetails,
    homeVolumeDetails,
    loadData,
    publicKeySection,
    requiredSection,
    setupScriptSection,
    userdataScriptSection,
  } = formData || {};

  const { isDebug, setupStepNumber } = debugSection ?? {};

  const { distro = "", region = defaultEC2Region } = requiredSection ?? {};
  const { defineSetupScriptCheckbox, setupScript } = setupScriptSection ?? {};
  const { runUserdataScript, userdataScript } = userdataScriptSection ?? {};

  const {
    loadDataOntoHostAtStartup,
    runProjectSpecificSetupScript,
    startHosts,
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
    ...(isDebug && setupStepNumber ? { setupStepNumber } : {}),
    distroId: distro,
    expiration: noExpiration ? null : new Date(expiration),
    homeVolumeSize:
      !migrateVolumeId &&
      isVirtualWorkStation &&
      (!selectExistingVolume || !volumeSelect)
        ? volumeSize
        : null,
    noExpiration: noExpiration,
    publicKey: {
      key: useExisting
        ? (myPublicKeys.find(({ name }) => name === publicKeyNameDropdown)
            ?.key ?? "")
        : stripNewLines(newPublicKey),
      name: useExisting ? publicKeyNameDropdown : newPublicKeyName,
    },
    region,
    savePublicKey: !useExisting && !!savePublicKey,
    setUpScript: defineSetupScriptCheckbox ? setupScript : null,
    sleepSchedule:
      noExpiration && hostUptime ? getSleepSchedule(hostUptime) : null,
    spawnHostsStartedByTask: !!(loadDataOntoHostAtStartup && startHosts),
    taskId:
      loadDataOntoHostAtStartup && validateTask(spawnTaskData)
        ? spawnTaskData?.id
        : null,
    useProjectSetupScript: !!(
      loadDataOntoHostAtStartup && runProjectSpecificSetupScript
    ),
    userDataScript: runUserdataScript ? userdataScript : null,
    volumeId:
      migrateVolumeId ||
      (isVirtualWorkStation && selectExistingVolume ? volumeSelect : null),
  };
};
