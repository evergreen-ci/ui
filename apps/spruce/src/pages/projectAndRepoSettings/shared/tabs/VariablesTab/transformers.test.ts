import { Unpacked } from "@evg-ui/lib/types/utils";
import { ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { VariablesFormState } from "./types";

const { projectBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL and omits empty fields", () => {
    expect(
      formToGql(
        {
          vars: [...form.vars, {} as Unpacked<VariablesFormState["vars"]>],
        },
        false,
        "project",
      ),
    ).toStrictEqual(result);
  });
});

const form: VariablesFormState = {
  vars: [
    {
      isAdminOnly: true,
      isDisabled: true,
      isPrivate: true,
      varDescription: "this is really important",
      varName: "test_name",
      varValue: "{REDACTED}",
    },
    {
      isAdminOnly: false,
      isDisabled: false,
      isPrivate: false,
      varDescription: "delete me later",
      varName: "test_two",
      varValue: "val",
    },
  ],
};

const result: Pick<ProjectSettingsInput, "projectId" | "projectRef" | "vars"> =
  {
    projectId: "project",
    projectRef: {
      id: "project",
    },
    vars: {
      adminOnlyVarsList: ["test_name"],
      privateVarsList: ["test_name"],
      vars: { test_name: "", test_two: "val" },
      varsDescriptions: {
        test_name: "this is really important",
        test_two: "delete me later",
      },
    },
  };
