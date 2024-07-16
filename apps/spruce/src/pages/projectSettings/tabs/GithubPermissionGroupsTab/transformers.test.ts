import { ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";

import { PermissionGroupsFormState } from "./types";

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

const projectForm: PermissionGroupsFormState = {
  permissionGroups: [
    {
      displayTitle: "permission-group-1",
      name: "permission-group-1",
      permissions: [
        { type: "actions", value: "read" },
        { type: "organization_hooks", value: "read" },
      ],
    },
    {
      displayTitle: "permission-group-2",
      name: "permission-group-2",
      permissions: [
        { type: "pull_requests", value: "write" },
        { type: "contents", value: "admin" },
      ],
    },
  ],
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    githubDynamicTokenPermissionGroups: [
      {
        name: "permission-group-1",
        permissions: {
          actions: "read",
          organization_hooks: "read",
        },
      },
      {
        name: "permission-group-2",
        permissions: {
          pull_requests: "write",
          contents: "admin",
        },
      },
    ],
    id: "project",
  },
};
