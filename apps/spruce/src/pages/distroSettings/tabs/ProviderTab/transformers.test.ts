import { DistroInput, Provider } from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { BuildType, ProviderFormState } from "./types";

const defaultTaskHostOverrides = {
  doNotAssignPublicIpv4Address: false,
  enableTaskHostOverrides: false,
  iamInstanceProfileArn: "",
  providerAccount: "",
  securityGroupIds: [],
  subnetId: "",
};

const defaultFormState = {
  dockerProviderSettings: {
    buildType: "" as BuildType,
    containerPoolId: "",
    imageUrl: "",
    mergeUserData: false,
    poolMappingInfo: "",
    registryPassword: "",
    registryUsername: "",
    securityGroups: ["1"],
    userData: "",
  },
  ec2FleetProviderSettings: [
    {
      amiId: "",
      displayTitle: undefined,
      doNotAssignPublicIPv4Address: true,
      elasticIpsEnabled: false,
      instanceProfileARN: "",
      instanceType: "",
      mergeUserData: false,
      mountPoints: [],
      region: "",
      securityGroups: ["1"],
      sshKeyName: "",
      userData: "",
      vpcOptions: {
        subnetId: "",
        subnetPrefix: "",
        useVpc: false,
      },
    },
  ],
  staticProviderSettings: {
    hosts: [],
    mergeUserData: false,
    securityGroups: ["1"],
    userData: "",
  },
  taskHostOverrides: defaultTaskHostOverrides,
};

describe("provider tab", () => {
  describe("static provider", () => {
    const staticDistroData = {
      ...distroData,
      containerPool: "",
      provider: Provider.Static,
      providerAccount: "",
      providerSettingsList: [
        {
          do_not_assign_public_ipv4_address: true,
          hosts: [{ name: "localhost-1" }, { name: "localhost-2" }],
          merge_user_data: false,
          security_group_ids: ["1"],
          user_data: "",
        },
      ],
    };

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const staticForm: ProviderFormState = {
      ...defaultFormState,
      provider: {
        providerAccount: "",
        providerName: Provider.Static,
      },
      staticProviderSettings: {
        hosts: [{ name: "localhost-1" }, { name: "localhost-2" }],
        mergeUserData: false,
        securityGroups: ["1"],
        userData: "",
      },
    };

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const staticGql: DistroInput = {
      ...distroData,
      containerPool: "",
      provider: Provider.Static,
      providerAccount: "",
      providerSettingsList: [
        {
          hosts: [{ name: "localhost-1" }, { name: "localhost-2" }],
          merge_user_data_parts: false,
          security_group_ids: ["1"],
          user_data: "",
        },
      ],
    };

    it("correctly converts from GQL to a form", () => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(gqlToForm(staticDistroData)).toStrictEqual(staticForm);
    });

    it("correctly converts from a form to GQL", () => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(formToGql(staticForm, staticDistroData)).toStrictEqual(staticGql);
    });
  });

  describe("docker provider", () => {
    const dockerDistroData = {
      ...distroData,
      containerPool: "pool-1",
      provider: Provider.Docker,
      providerAccount: "",
      providerSettingsList: [
        {
          build_type: "import",
          do_not_assign_public_ipv4_address: true,
          docker_registry_pw: "abc-123",
          docker_registry_user: "testuser",
          image_url: "https://some-url",
          merge_user_data: false,
          security_group_ids: ["1"],
          user_data: "",
        },
      ],
    };

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const dockerForm: ProviderFormState = {
      ...defaultFormState,
      dockerProviderSettings: {
        buildType: BuildType.Import,
        containerPoolId: "pool-1",
        imageUrl: "https://some-url",
        mergeUserData: false,
        poolMappingInfo: "",
        registryPassword: "abc-123",
        registryUsername: "testuser",
        securityGroups: ["1"],
        userData: "",
      },
      provider: {
        providerAccount: "",
        providerName: Provider.Docker,
      },
    };

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const dockerGql: DistroInput = {
      ...distroData,
      containerPool: "pool-1",
      provider: Provider.Docker,
      providerAccount: "",
      providerSettingsList: [
        {
          build_type: "import",
          docker_registry_pw: "abc-123",
          docker_registry_user: "testuser",
          image_url: "https://some-url",
          merge_user_data_parts: false,
          security_group_ids: ["1"],
          user_data: "",
        },
      ],
    };

    it("correctly converts from GQL to a form", () => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(gqlToForm(dockerDistroData)).toStrictEqual(dockerForm);
    });

    it("correctly converts from a form to GQL", () => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(formToGql(dockerForm, dockerDistroData)).toStrictEqual(dockerGql);
    });
  });

  describe("ec2 fleet provider", () => {
    const ec2FleetDistroData = {
      ...distroData,
      containerPool: "",
      provider: Provider.Ec2Fleet,
      providerSettingsList: [
        {
          ami: "ami-east",
          do_not_assign_public_ipv4_address: true,
          elastic_ips_enabled: false,
          iam_instance_profile_arn: "profile-east",
          instance_type: "m5.xlarge",
          is_vpc: true,
          key_name: "admin",
          merge_user_data_parts: false,
          mount_points: [
            {
              device_name: "device-east",
              size: 200,
            },
          ],
          region: "us-east-1",
          security_group_ids: ["1"],
          subnet_id: "subnet-east",
          user_data: "",
          vpc_name: "vpc-east",
        },
      ],
    };

    const ec2Form: ProviderFormState = {
      ...defaultFormState,
      ec2FleetProviderSettings: [
        {
          amiId: "ami-east",
          displayTitle: "us-east-1",
          doNotAssignPublicIPv4Address: true,
          elasticIpsEnabled: false,
          instanceProfileARN: "profile-east",
          instanceType: "m5.xlarge",
          mergeUserData: false,
          mountPoints: [
            {
              deviceName: "device-east",
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              iops: undefined,
              size: 200,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              throughput: undefined,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              virtualName: undefined,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              volumeType: undefined,
            },
          ],
          region: "us-east-1",
          securityGroups: ["1"],
          sshKeyName: "admin",
          userData: "",
          vpcOptions: {
            subnetId: "subnet-east",
            subnetPrefix: "vpc-east",
            useVpc: true,
          },
        },
      ],
      provider: {
        providerAccount: "aws",
        providerName: Provider.Ec2Fleet,
      },
    };

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const ec2Gql: DistroInput = {
      ...distroData,
      containerPool: "",
      provider: Provider.Ec2Fleet,
      providerAccount: "aws",
      providerSettingsList: [
        {
          ami: "ami-east",
          do_not_assign_public_ipv4_address: true,
          elastic_ips_enabled: false,
          iam_instance_profile_arn: "profile-east",
          instance_type: "m5.xlarge",
          is_vpc: true,
          key_name: "admin",
          merge_user_data_parts: false,
          mount_points: [
            {
              device_name: "device-east",
              iops: undefined,
              size: 200,
              throughput: undefined,
              virtual_name: undefined,
              volume_type: undefined,
            },
          ],
          region: "us-east-1",
          security_group_ids: ["1"],
          subnet_id: "subnet-east",
          user_data: "",
          vpc_name: "vpc-east",
        },
      ],
      taskHostOverrides: null,
    };

    it("correctly converts from GQL to a form", () => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(gqlToForm(ec2FleetDistroData)).toStrictEqual(ec2Form);
    });

    it("correctly converts from a form to GQL", () => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(formToGql(ec2Form, ec2FleetDistroData)).toStrictEqual(ec2Gql);
    });
  });

  describe("ec2 fleet provider with task host overrides", () => {
    const populatedTaskHostOverrides = {
      doNotAssignPublicIpv4Address: true,
      enableTaskHostOverrides: true,
      iamInstanceProfileArn: "task-host-arn",
      providerAccount: "task-host-account",
      securityGroupIds: ["sg-task"],
      subnetId: "subnet-task",
    };

    const ec2FleetDistroData = {
      ...distroData,
      containerPool: "",
      provider: Provider.Ec2Fleet,
      providerSettingsList: [
        {
          ami: "ami-east",
          do_not_assign_public_ipv4_address: true,
          elastic_ips_enabled: false,
          iam_instance_profile_arn: "profile-east",
          instance_type: "m5.xlarge",
          is_vpc: true,
          key_name: "admin",
          merge_user_data_parts: false,
          mount_points: [],
          region: "us-east-1",
          security_group_ids: ["1"],
          subnet_id: "subnet-east",
          user_data: "",
          vpc_name: "vpc-east",
        },
      ],
      taskHostOverrides: {
        __typename: "TaskHostOverrides" as const,
        doNotAssignPublicIpv4Address: true,
        iamInstanceProfileArn: "task-host-arn",
        providerAccount: "task-host-account",
        securityGroupIds: ["sg-task"],
        subnetId: "subnet-task",
      },
    };

    const ec2Form: ProviderFormState = {
      ...defaultFormState,
      ec2FleetProviderSettings: [
        {
          amiId: "ami-east",
          displayTitle: "us-east-1",
          doNotAssignPublicIPv4Address: true,
          elasticIpsEnabled: false,
          instanceProfileARN: "profile-east",
          instanceType: "m5.xlarge",
          mergeUserData: false,
          mountPoints: [],
          region: "us-east-1",
          securityGroups: ["1"],
          sshKeyName: "admin",
          userData: "",
          vpcOptions: {
            subnetId: "subnet-east",
            subnetPrefix: "vpc-east",
            useVpc: true,
          },
        },
      ],
      provider: {
        providerAccount: "aws",
        providerName: Provider.Ec2Fleet,
      },
      taskHostOverrides: populatedTaskHostOverrides,
    };

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const ec2Gql: DistroInput = {
      ...distroData,
      containerPool: "",
      provider: Provider.Ec2Fleet,
      providerAccount: "aws",
      providerSettingsList: [
        {
          ami: "ami-east",
          do_not_assign_public_ipv4_address: true,
          elastic_ips_enabled: false,
          iam_instance_profile_arn: "profile-east",
          instance_type: "m5.xlarge",
          is_vpc: true,
          key_name: "admin",
          merge_user_data_parts: false,
          mount_points: [],
          region: "us-east-1",
          security_group_ids: ["1"],
          subnet_id: "subnet-east",
          user_data: "",
          vpc_name: "vpc-east",
        },
      ],
      taskHostOverrides: {
        doNotAssignPublicIpv4Address: true,
        iamInstanceProfileArn: "task-host-arn",
        providerAccount: "task-host-account",
        securityGroupIds: ["sg-task"],
        subnetId: "subnet-task",
      },
    };

    it("enables the toggle and populates fields when GQL has overrides", () => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(gqlToForm(ec2FleetDistroData)).toStrictEqual(ec2Form);
    });

    it("sends a populated TaskHostOverridesInput when the toggle is on", () => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(formToGql(ec2Form, ec2FleetDistroData)).toStrictEqual(ec2Gql);
    });

    it("sends null when the toggle is off, even if fields still hold stale values", () => {
      const formWithToggleOff: ProviderFormState = {
        ...ec2Form,
        taskHostOverrides: {
          ...populatedTaskHostOverrides,
          enableTaskHostOverrides: false,
        },
      };
      const gqlWithoutOverrides = {
        ...ec2Gql,
        taskHostOverrides: null,
      };
      expect(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        formToGql(formWithToggleOff, ec2FleetDistroData),
      ).toStrictEqual(gqlWithoutOverrides);
    });
  });
});
