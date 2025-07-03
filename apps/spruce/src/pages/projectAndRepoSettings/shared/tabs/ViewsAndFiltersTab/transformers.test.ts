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
      displayTitle: "repo-filter",
      description: "Repo Filter",
      expression: "repo-filter",
      caseSensitive: false,
      exactMatch: false,
    },
  ],
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef"> = {
  repoId: "repo",
  projectRef: {
    id: "repo",
    parsleyFilters: [
      {
        description: "Repo Filter",
        expression: "repo-filter",
        caseSensitive: false,
        exactMatch: false,
      },
    ],
  },
};

const projectForm: ViewsFormState = {
  parsleyFilters: [
    {
      displayTitle: "filter_1",
      description: "Filter One",
      expression: "filter_1",
      caseSensitive: true,
      exactMatch: true,
    },
    {
      displayTitle: "filter_2",
      description: "Filter Two",
      expression: "filter_2",
      caseSensitive: false,
      exactMatch: false,
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
