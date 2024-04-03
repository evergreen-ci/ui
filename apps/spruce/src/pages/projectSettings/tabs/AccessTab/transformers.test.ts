import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { AccessFormState } from "./types";

const { projectBase, repoBase } = data;

describe("repo data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(repoBase)).toStrictEqual(repoForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(repoForm, true, "repo")).toStrictEqual(repoResult);
  });
});

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

const projectForm: AccessFormState = {
  accessSettings: {
    restricted: true,
  },
  admin: {
    admins: [],
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    id: "project",
    restricted: true,
    admins: [],
  },
};

const repoForm: AccessFormState = {
  accessSettings: {
    restricted: true,
  },
  admin: {
    admins: ["admin"],
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef"> = {
  repoId: "repo",
  projectRef: {
    id: "repo",
    restricted: true,
    admins: ["admin"],
  },
};
