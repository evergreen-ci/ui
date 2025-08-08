import { CostData, DistroInput } from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { GeneralFormState } from "./types";

describe("general tab", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(distroData)).toStrictEqual(generalForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(generalForm, distroData)).toStrictEqual(generalGql);
  });

  describe("cost data handling", () => {
    it("handles missing cost data by setting default values", () => {
      const distroWithoutCostData = { ...distroData, costData: null };
      const result = gqlToForm(distroWithoutCostData as typeof distroData);
      expect(result?.costData).toStrictEqual({
        onDemandRate: 0,
        savingsPlanRate: 0,
      });
    });

    it("handles undefined cost data by setting default values", () => {
      const distroWithoutCostData = { ...distroData, costData: undefined };
      const result = gqlToForm(distroWithoutCostData as typeof distroData);
      expect(result?.costData).toStrictEqual({
        onDemandRate: 0,
        savingsPlanRate: 0,
      });
    });

    it("preserves cost data when both rates are provided", () => {
      const customCostData = { onDemandRate: 0.05, savingsPlanRate: 0.15 };
      const distroWithCustomCost = { ...distroData, costData: customCostData };
      const result = gqlToForm(distroWithCustomCost as typeof distroData);
      expect(result?.costData).toStrictEqual(customCostData);
    });

    it("handles partial cost data by setting defaults for missing fields", () => {
      const partialCostData = { onDemandRate: 0.2 };
      const distroWithPartialCostData = {
        ...distroData,
        costData: partialCostData as Partial<CostData>,
      };
      const result = gqlToForm(distroWithPartialCostData as typeof distroData);
      expect(result?.costData).toStrictEqual({
        onDemandRate: 0.2,
        savingsPlanRate: 0,
      });
    });
  });
});

const generalForm: GeneralFormState = {
  distroName: {
    name: "rhel71-power8-large",
  },
  distroImage: {
    image: "rhel71-power8",
  },
  distroAliases: {
    aliases: ["rhel71-power8", "rhel71-power8-build"],
  },
  distroOptions: {
    adminOnly: false,
    isCluster: false,
    singleTaskDistro: false,
    disableShallowClone: true,
    disabled: false,
    note: "distro note",
    warningNote: "distro warnings",
  },
  costData: {
    onDemandRate: 0.01,
    savingsPlanRate: 0.02,
  },
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
const generalGql: DistroInput = {
  ...distroData,
  name: "rhel71-power8-large",
  imageId: "rhel71-power8",
  adminOnly: false,
  aliases: ["rhel71-power8", "rhel71-power8-build"],
  isCluster: false,
  disableShallowClone: true,
  disabled: false,
  note: "distro note",
  singleTaskDistro: false,
};
