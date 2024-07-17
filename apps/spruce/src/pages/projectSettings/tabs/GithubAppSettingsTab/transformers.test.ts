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
    permissionsByRequester: [
      { permissionGroup: "", requesterType: "github_pull_request" },
      { permissionGroup: "", requesterType: "patch_request" },
      { permissionGroup: "", requesterType: "git_tag_request" },
      {
        permissionGroup: "permission-group-1",
        requesterType: "gitter_request",
      },
      {
        permissionGroup: "permission-group-2",
        requesterType: "trigger_request",
      },
      { permissionGroup: "", requesterType: "ad_hoc" },
      { permissionGroup: "", requesterType: "github_merge_request" },
    ],
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    githubPermissionGroupByRequester: {
      gitter_request: "permission-group-1",
      trigger_request: "permission-group-2",
    },
    id: "project",
  },
};
