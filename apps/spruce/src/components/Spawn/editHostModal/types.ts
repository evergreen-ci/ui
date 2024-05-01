export type FormState = {
  hostName?: string;
  expirationDetails?: {
    noExpiration: boolean;
    expiration?: string;
    hostUptime?: {
      useDefaultUptimeSchedule: boolean;
      sleepSchedule?: {
        enabledWeekdays: boolean[];
        timeSelection: {
          startTime: string;
          stopTime: string;
          runContinuously: boolean;
        };
      };
    };
  };
  instanceType?: string;
  volume?: string;
  rdpPassword?: string;
  userTags?: Array<{
    key: string;
    value: string;
  }>;
  publicKeySection?: {
    useExisting: boolean;
    newPublicKey?: string;
    publicKeyNameDropdown?: string;
    savePublicKey?: boolean;
    newPublicKeyName?: string;
  };
};
