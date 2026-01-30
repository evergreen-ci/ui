import { HostUptime } from "../utils";

export type FormState = {
  isDebug?: boolean;
  requiredSection?: {
    distro?: string;
    region?: string;
  };
  publicKeySection?: {
    useExisting: boolean;
    newPublicKey?: string;
    publicKeyNameDropdown?: string;
    savePublicKey?: boolean;
    newPublicKeyName?: string;
  };
  expirationDetails?: {
    noExpiration: boolean;
    expiration?: string;
    hostUptime?: HostUptime;
  };
  userdataScriptSection?: {
    runUserdataScript: boolean;
    userdataScript?: string;
  };
  setupScriptSection?: {
    defineSetupScriptCheckbox: boolean;
    setupScript?: string;
  };
  homeVolumeDetails?: {
    selectExistingVolume: boolean;
    volumeSize?: number;
    volumeSelect?: string;
  };
  loadData?: {
    loadDataOntoHostAtStartup: boolean;
    runProjectSpecificSetupScript?: boolean;
    startHosts?: boolean;
    useOAuth?: boolean;
  };
};
