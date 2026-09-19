import { getFormSchema } from "./getFormSchema";
import { ProviderFormState } from "./types";

const taskHostOverrides: ProviderFormState["taskHostOverrides"] = {
  doNotAssignPublicIpv4Address: false,
  enableTaskHostOverrides: false,
  iamInstanceProfileArn: "",
  providerAccount: "",
  securityGroupIds: [],
  subnetId: "",
};

const ec2FleetProviderSettings: ProviderFormState["ec2FleetProviderSettings"] =
  [
    {
      amiId: "ami-1234",
      displayTitle: "us-east-1",
      doNotAssignPublicIPv4Address: false,
      elasticIpsEnabled: false,
      enableNestedVirtualization: false,
      instanceProfileARN: "",
      instanceType: "m5.xlarge",
      mergeUserData: false,
      mountPoints: [],
      region: "us-east-1",
      securityGroups: [],
      sshKeyName: "",
      userData: "",
      vpcOptions: {
        subnetId: "",
        subnetPrefix: "",
        subnetTagName: "",
        subnetTagValue: "",
        useVpc: false,
      },
    },
  ];

const getEC2FleetFormSchema = () => {
  const formSchema = getFormSchema({
    awsRegions: ["us-east-1", "us-west-1"],
    ec2FleetProviderSettings,
    fleetRegionsInUse: ["us-east-1"],
    isEC2Provider: true,
    poolMappingInfo: "",
    pools: [],
    taskHostOverrides,
  });

  return formSchema;
};

describe("getFormSchema", () => {
  it("restores EC2 Fleet settings when switching providers", () => {
    expect(
      getEC2FleetFormSchema().schema.dependencies?.provider?.oneOf?.[2],
    ).toMatchObject({
      properties: {
        ec2FleetProviderSettings: { default: ec2FleetProviderSettings },
        taskHostOverrides: { default: taskHostOverrides },
      },
    });
  });

  it("appends new region settings after the existing defaults", () => {
    expect(
      getEC2FleetFormSchema().uiSchema.ec2FleetProviderSettings,
    ).toHaveProperty("ui:addToEnd", true);
  });
});
