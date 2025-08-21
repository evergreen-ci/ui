import {
  EcsArchitecture,
  EcsOperatingSystem,
  EcsWindowsVersion,
} from "gql/generated/types";

export interface ProvidersFormState {
  providers: {
    containerPools: {
      pools: Array<{
        id: string;
        distro: string;
        maxContainers: number;
        port: number;
      }>;
    };

    aws: {
      subnets: Array<{
        az: string;
        subnetId: string;
      }>;
      accountRoles: Array<{
        account: string;
        role: string;
      }>;
      ec2Key: string;
      ec2Secret: string;
      parameterStorePrefix: string;
      defaultSecurityGroup: string;
      maxVolumeSizePerUser: number;
      allowedInstanceTypes: string[];
      alertableInstanceTypes: string[];
      allowedRegions: string[];
      ipamPoolID: string;
      elasticIPUsageRate: number;

      persistentDNS: {
        hostedZoneID: string;
        domain: string;
      };

      parserProject: {
        bucket: string;
        generatedJSONPrefix: string;
        key: string;
        prefix: string;
        secret: string;
      };

      pod: {
        maxCPU: number;
        maxMemoryMb: number;
        role: string;
        region: string;
        podSecretManager: string;
        taskDefinitionPrefix: string;
        taskRole: string;
        executionRole: string;
        logRegion: string;
        logGroup: string;
        logStreamPrefix: string;
        allowedImages: string[];
        awsVPCSubnets: {
          subnets: string[];
        };
        awsVPCSecurityGroups: {
          securityGroups: string[];
        };

        clusters: Array<{
          name: string;
          os?: EcsOperatingSystem;
        }>;

        capacityProviders: Array<{
          name: string;
          arch?: EcsArchitecture;
          os?: EcsOperatingSystem;
          windowsVersion?: EcsWindowsVersion;
        }>;
      };

      docker: {
        apiVersion: string;
      };
    };
  };
}

export type TabProps = {
  providersData: ProvidersFormState;
};
