import { Requester } from "constants/requesters";
import { ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { AppSettingsFormState } from "./types";

const { projectBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectForm, false, "project")).toStrictEqual(
      projectResult,
    );
  });
});

const projectForm: AppSettingsFormState = {
  tokenPermissionRestrictions: {
    permissionsByRequester: Object.values(Requester).map((requesterType) => {
      let permissionGroup = "";
      if (requesterType === Requester.Gitter) {
        permissionGroup = "permission-group-1";
      }
      if (requesterType === Requester.Trigger) {
        permissionGroup = "permission-group-2";
      }
      return { permissionGroup, requesterType };
    }),
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    githubPermissionGroupByRequester: {
      [Requester.Gitter]: "permission-group-1",
      [Requester.Trigger]: "permission-group-2",
    },
    id: "project",
  },
};
