import { DistroInput } from "gql/generated/types";
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
    disableShallowClone: true,
    disabled: false,
    note: "distro note",
    warningNote: "distro warnings",
  },
};

// @ts-ignore: FIXME. This comment was added by an automated script.
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
};
