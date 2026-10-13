import { getFormSchema } from "./getFormSchema";

describe("getFormSchema", () => {
  it("appends new region settings after the existing ones", () => {
    const { uiSchema } = getFormSchema({
      awsRegions: ["us-east-1", "us-west-1"],
      fleetRegionsInUse: ["us-east-1"],
      isEC2Provider: true,
      poolMappingInfo: "",
      pools: [],
    });
    expect(uiSchema.ec2FleetProviderSettings).toHaveProperty(
      "ui:addToEnd",
      true,
    );
  });
});
