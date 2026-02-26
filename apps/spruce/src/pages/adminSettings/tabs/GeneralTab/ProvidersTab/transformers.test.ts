import { AdminSettingsInput } from "gql/generated/types";
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
      persistentDNS: {
        hostedZoneID: "Z123456789",
        domain: "test.example.com",
      },
      parserProject: {
        key: "test-parser-key",
        secret: "test-parser-secret",
        bucket: "test-parser-bucket",
        prefix: "test-parser-prefix",
        generatedJSONPrefix: "test-json-prefix",
      },
      defaultSecurityGroup: "sg-default123",
      maxVolumeSizePerUser: 100,
      allowedInstanceTypes: ["m5.large", "m5.xlarge", "c5.large"],
      alertableInstanceTypes: ["m5.2xlarge", "c5.2xlarge"],
      allowedRegions: ["us-east-1", "us-west-2"],
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
      ipamPoolID: "ipam-pool-123",
      elasticIPUsageRate: 0.8,
    },
    docker: {
      apiVersion: "1.40",
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
};
