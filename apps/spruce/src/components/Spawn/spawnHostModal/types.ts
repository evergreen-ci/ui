export type FormState = {
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
    hostUptime?: {
      useDefaultUptimeSchedule: boolean;
      sleepSchedule: {
        enabledWeekdays: boolean[];
        timeSelection: {
          startTime: string;
          endTime: string;
          runContinuously: boolean;
        };
      };
    };
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
    taskSync?: boolean;
    startHosts?: boolean;
  };
};
