import { DistroQuery, Provider } from "gql/generated/types";

export enum BuildType {
  Import = "import",
  Pull = "pull",
}

export type ProviderFormState = {
  provider: {
    providerName: Provider;
    providerAccount: string;
  };
  staticProviderSettings: {
    userData: string;
    mergeUserData: boolean;
    securityGroups: string[];
    hosts: Array<{
      name: string;
    }>;
  };
  dockerProviderSettings: {
    imageUrl: string;
    buildType: BuildType;
    registryUsername: string;
    registryPassword: string;
    containerPoolId: string;
    poolMappingInfo: string;
    userData: string;
    mergeUserData: boolean;
    securityGroups: string[];
  };
  ec2FleetProviderSettings: Array<{
    displayTitle: string;
    region: string;
    amiId: string;
    instanceType: string;
    sshKeyName: string;
    instanceProfileARN: string;
    elasticIpsEnabled: boolean;
    doNotAssignPublicIPv4Address: boolean;
    vpcOptions: {
      useVpc: boolean;
      subnetId: string;
      subnetPrefix: string;
    };
    mountPoints: Array<{
      deviceName: string;
      virtualName: string;
      volumeType: string;
      iops: number;
      throughput: number;
      size: number;
    }>;
    userData: string;
    mergeUserData: boolean;
    securityGroups: string[];
  }>;
  ec2OnDemandProviderSettings: Array<{
    displayTitle: string;
    region: string;
    amiId: string;
    instanceType: string;
    sshKeyName: string;
    instanceProfileARN: string;
    elasticIpsEnabled: boolean;
    doNotAssignPublicIPv4Address: boolean;
    vpcOptions: {
      useVpc: boolean;
      subnetId: string;
      subnetPrefix: string;
    };
    mountPoints: Array<{
      deviceName: string;
      virtualName: string;
      volumeType: string;
      iops: number;
      throughput: number;
      size: number;
    }>;
    userData: string;
    mergeUserData: boolean;
    securityGroups: string[];
  }>;
};

export type TabProps = {
  distro: DistroQuery["distro"];
  distroData: ProviderFormState;
};
