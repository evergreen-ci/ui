import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { ViewsFormState } from "./types";

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

const repoForm: ViewsFormState = {
  parsleyFilters: [
    {
      caseSensitive: false,
      description: "Repo Filter",
      displayTitle: "repo-filter",
      exactMatch: false,
      expression: "repo-filter",
    },
  ],
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef"> = {
  projectRef: {
    id: "repo",
    parsleyFilters: [
      {
        caseSensitive: false,
        description: "Repo Filter",
        exactMatch: false,
        expression: "repo-filter",
      },
    ],
  },
  repoId: "repo",
};

const projectForm: ViewsFormState = {
  parsleyFilters: [
    {
      caseSensitive: true,
      description: "Filter One",
      displayTitle: "filter_1",
      exactMatch: true,
      expression: "filter_1",
    },
    {
      caseSensitive: false,
      description: "Filter Two",
      displayTitle: "filter_2",
      exactMatch: false,
      expression: "filter_2",
    },
  ],
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    id: "project",
    parsleyFilters: [
      {
        caseSensitive: true,
        description: "Filter One",
        exactMatch: true,
        expression: "filter_1",
      },
      {
        caseSensitive: false,
        description: "Filter Two",
        exactMatch: false,
        expression: "filter_2",
      },
    ],
  },
};
