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
    };

    docker: {
      apiVersion: string;
    };
  };
}

export type TabProps = {
  providersData: ProvidersFormState;
};
