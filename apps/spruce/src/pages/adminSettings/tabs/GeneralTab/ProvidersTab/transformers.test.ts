import {
  AdminSettingsInput,
  EcsArchitecture,
  EcsOperatingSystem,
  EcsWindowsVersion,
} from "gql/generated/types";
import { adminSettings } from "../../testData";
import { formToGql, gqlToForm } from "./transformers";
import { ProvidersFormState } from "./types";

describe("providers section", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(testAdminSettings)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form)).toStrictEqual(gql);
  });
});

const form: ProvidersFormState = {
  providers: {
    containerPools: {
      pools: [
        {
          id: "test-pool-1",
          distro: "ubuntu2004-small",
          maxContainers: 10,
          port: 8080,
        },
        {
          id: "test-pool-2",
          distro: "archlinux-test",
          maxContainers: 5,
          port: 9000,
        },
      ],
    },
    aws: {
      subnets: [
        {
          az: "us-east-1a",
          subnetId: "subnet-12345",
        },
        {
          az: "us-east-1b",
          subnetId: "subnet-67890",
        },
      ],
      ec2Key: "test-ec2-key",
      ec2Secret: "test-ec2-secret",
      parameterStorePrefix: "/evergreen/test",
      parserProjectS3Key: "test-parser-key",
      parserProjectS3Secret: "test-parser-secret",
      parserProjectS3Bucket: "test-parser-bucket",
      parserProjectS3Prefix: "test-parser-prefix",
      persistentDNSHostedZoneId: "Z123456789",
      persistentDNSDomainName: "test.example.com",
      generatedJsonFilesS3Prefix: "test-json-prefix",
      defaultSecurityGroup: "sg-default123",
      maxVolumeSizePerUser: 100,
      allowedInstanceTypes: ["m5.large", "m5.xlarge", "c5.large"],
      alertableInstanceTypes: ["m5.2xlarge", "c5.2xlarge"],
      allowedRegions: ["us-east-1", "us-west-2"],
      allowedImages: ["ubuntu:20.04", "amazon/amazonlinux:latest"],
      maxCPU: 2048,
      maxMemoryMb: 4096,
      role: "arn:aws:iam::123456789:role/EcsTaskRole",
      region: "us-east-1",
      podSecretManager: "evergreen-secrets",
      taskDefinitionPrefix: "evg-task",
      taskRole: "arn:aws:iam::123456789:role/TaskRole",
      executionRole: "arn:aws:iam::123456789:role/ExecutionRole",
      logRegion: "us-east-1",
      logGroup: "/ecs/evergreen",
      logStreamPrefix: "evg-pod",
      accountRoles: [
        {
          account: "123456789",
          role: "arn:aws:iam::123456789:role/CrossAccountRole",
        },
        {
          account: "987654321",
          role: "arn:aws:iam::987654321:role/AnotherRole",
        },
      ],
      awsVPCSubnets: {
        subnets: ["subnet-vpc1", "subnet-vpc2"],
      },
      awsVPCSecurityGroups: {
        securityGroups: ["sg-vpc1", "sg-vpc2"],
      },
      clusters: [
        {
          name: "test-cluster-1",
          os: EcsOperatingSystem.EcsosLinux,
        },
        {
          name: "test-cluster-2",
          os: EcsOperatingSystem.EcsosWindows,
        },
      ],
      capacityProviders: [
        {
          name: "test-provider-1",
          arch: EcsArchitecture.EcsArchAmd64,
          os: EcsOperatingSystem.EcsosLinux,
          windowsVersion: undefined,
        },
        {
          name: "test-provider-2",
          arch: EcsArchitecture.EcsArchArm64,
          os: EcsOperatingSystem.EcsosWindows,
          windowsVersion: EcsWindowsVersion.EcsWindowsServer_2019,
        },
      ],
      docker: {
        apiVersion: "1.40",
      },
      ipamPoolID: "ipam-pool-123",
      elasticIPUsageRate: 0.8,
      parserProject: {
        bucket: "test-parser-bucket",
        generatedJSONPrefix: "test-json-prefix",
        key: "test-parser-key",
        prefix: "test-parser-prefix",
        secret: "test-parser-secret",
      },
    },
    repoExceptions: {
      repos: [
        {
          owner: "evergreen-ci",
          repo: "evergreen",
        },
        {
          owner: "mongodb",
          repo: "mongo",
        },
      ],
    },
  },
};

const gql: AdminSettingsInput = {
  containerPools: {
    pools: [
      {
        id: "test-pool-1",
        distro: "ubuntu2004-small",
        maxContainers: 10,
        port: 8080,
      },
      {
        id: "test-pool-2",
        distro: "archlinux-test",
        maxContainers: 5,
        port: 9000,
      },
    ],
  },
  parameterStore: {
    prefix: "/evergreen/test",
  },
  providers: {
    aws: {
      accountRoles: [
        {
          account: "123456789",
          role: "arn:aws:iam::123456789:role/CrossAccountRole",
        },
        {
          account: "987654321",
          role: "arn:aws:iam::987654321:role/AnotherRole",
        },
      ],
      alertableInstanceTypes: ["m5.2xlarge", "c5.2xlarge"],
      allowedInstanceTypes: ["m5.large", "m5.xlarge", "c5.large"],
      allowedRegions: ["us-east-1", "us-west-2"],
      defaultSecurityGroup: "sg-default123",
      ec2Keys: [
        {
          name: "default",
          key: "test-ec2-key",
          secret: "test-ec2-secret",
        },
      ],
      elasticIPUsageRate: 0.8,
      ipamPoolID: "ipam-pool-123",
      maxVolumeSizePerUser: 100,
      parserProject: {
        bucket: "test-parser-bucket",
        generatedJSONPrefix: "test-json-prefix",
        key: "test-parser-key",
        prefix: "test-parser-prefix",
        secret: "test-parser-secret",
      },
      persistentDNS: {
        hostedZoneID: "Z123456789",
        domain: "test.example.com",
      },
      pod: {
        region: "us-east-1",
        role: "arn:aws:iam::123456789:role/EcsTaskRole",
        ecs: {
          allowedImages: ["ubuntu:20.04", "amazon/amazonlinux:latest"],
          clusters: [
            {
              name: "test-cluster-1",
              os: EcsOperatingSystem.EcsosWindows,
            },
            {
              name: "test-cluster-2",
              os: EcsOperatingSystem.EcsosWindows,
            },
          ],
          capacityProviders: [
            {
              name: "test-provider-1",
              arch: EcsArchitecture.EcsArchAmd64,
              os: EcsOperatingSystem.EcsosLinux,
              windowsVersion: undefined,
            },
            {
              name: "test-provider-2",
              arch: EcsArchitecture.EcsArchArm64,
              os: EcsOperatingSystem.EcsosWindows,
              windowsVersion: EcsWindowsVersion.EcsWindowsServer_2019,
            },
          ],
          taskDefinitionPrefix: "evg-task",
          taskRole: "arn:aws:iam::123456789:role/TaskRole",
          executionRole: "arn:aws:iam::123456789:role/ExecutionRole",
          logRegion: "us-east-1",
          logGroup: "/ecs/evergreen",
          logStreamPrefix: "evg-pod",
          maxCPU: 2048,
          maxMemoryMb: 4096,
          awsVPC: {
            subnets: ["subnet-vpc1", "subnet-vpc2"],
            securityGroups: ["sg-vpc1", "sg-vpc2"],
          },
        },
        secretsManager: {
          secretPrefix: "evergreen-secrets",
        },
      },
      subnets: [
        {
          az: "us-east-1a",
          subnetId: "subnet-12345",
        },
        {
          az: "us-east-1b",
          subnetId: "subnet-67890",
        },
      ],
    },
    docker: {
      apiVersion: "1.40",
    },
  },
  projectCreation: {
    repoExceptions: [
      {
        owner: "evergreen-ci",
        repo: "evergreen",
      },
      {
        owner: "mongodb",
        repo: "mongo",
      },
    ],
  },
};

// Test admin settings data that includes providers information
const testAdminSettings = {
  ...adminSettings,
  containerPools: {
    pools: [
      {
        id: "test-pool-1",
        distro: "ubuntu2004-small",
        maxContainers: 10,
        port: 8080,
      },
      {
        id: "test-pool-2",
        distro: "archlinux-test",
        maxContainers: 5,
        port: 9000,
      },
    ],
  },
  parameterStore: {
    prefix: "/evergreen/test",
  },
  providers: {
    aws: {
      accountRoles: [
        {
          account: "123456789",
          role: "arn:aws:iam::123456789:role/CrossAccountRole",
        },
        {
          account: "987654321",
          role: "arn:aws:iam::987654321:role/AnotherRole",
        },
      ],
      alertableInstanceTypes: ["m5.2xlarge", "c5.2xlarge"],
      allowedInstanceTypes: ["m5.large", "m5.xlarge", "c5.large"],
      allowedRegions: ["us-east-1", "us-west-2"],
      defaultSecurityGroup: "sg-default123",
      ec2Keys: [
        {
          name: "default",
          key: "test-ec2-key",
          secret: "test-ec2-secret",
        },
      ],
      elasticIPUsageRate: 0.8,
      ipamPoolID: "ipam-pool-123",
      maxVolumeSizePerUser: 100,
      parserProject: {
        bucket: "test-parser-bucket",
        generatedJSONPrefix: "test-json-prefix",
        key: "test-parser-key",
        prefix: "test-parser-prefix",
        secret: "test-parser-secret",
      },
      persistentDNS: {
        hostedZoneID: "Z123456789",
        domain: "test.example.com",
      },
      pod: {
        region: "us-east-1",
        role: "arn:aws:iam::123456789:role/EcsTaskRole",
        ecs: {
          allowedImages: ["ubuntu:20.04", "amazon/amazonlinux:latest"],
          clusters: [
            {
              name: "test-cluster-1",
              os: EcsOperatingSystem.EcsosLinux,
            },
            {
              name: "test-cluster-2",
              os: EcsOperatingSystem.EcsosWindows,
            },
          ],
          capacityProviders: [
            {
              name: "test-provider-1",
              arch: EcsArchitecture.EcsArchAmd64,
              os: EcsOperatingSystem.EcsosLinux,
              windowsVersion: undefined,
            },
            {
              name: "test-provider-2",
              arch: EcsArchitecture.EcsArchArm64,
              os: EcsOperatingSystem.EcsosWindows,
              windowsVersion: EcsWindowsVersion.EcsWindowsServer_2019,
            },
          ],
          taskDefinitionPrefix: "evg-task",
          taskRole: "arn:aws:iam::123456789:role/TaskRole",
          executionRole: "arn:aws:iam::123456789:role/ExecutionRole",
          logRegion: "us-east-1",
          logGroup: "/ecs/evergreen",
          logStreamPrefix: "evg-pod",
          maxCPU: 2048,
          maxMemoryMb: 4096,
          awsVPC: {
            subnets: ["subnet-vpc1", "subnet-vpc2"],
            securityGroups: ["sg-vpc1", "sg-vpc2"],
          },
        },
        secretsManager: {
          secretPrefix: "evergreen-secrets",
        },
      },
      subnets: [
        {
          az: "us-east-1a",
          subnetId: "subnet-12345",
        },
        {
          az: "us-east-1b",
          subnetId: "subnet-67890",
        },
      ],
    },
    docker: {
      apiVersion: "1.40",
    },
  },
  projectCreation: {
    repoExceptions: [
      {
        owner: "evergreen-ci",
        repo: "evergreen",
      },
      {
        owner: "mongodb",
        repo: "mongo",
      },
    ],
  },
};
