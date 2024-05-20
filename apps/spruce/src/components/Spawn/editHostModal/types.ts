import { HostUptime } from "../utils";

export type FormState = {
  hostName?: string;
  expirationDetails?: {
    noExpiration: boolean;
    expiration?: string;
    hostUptime?: HostUptime;
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
