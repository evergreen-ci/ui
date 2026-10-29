import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { TaskOwnershipAndFoliageFormState } from "./types";

const { projectBase, repoBase } = data;

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

describe("repo data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(repoBase)).toStrictEqual(repoForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(repoForm, true, "repo")).toStrictEqual(repoResult);
  });
});

const projectForm: TaskOwnershipAndFoliageFormState = {
  mothra: {
    defaultMothraTeam: "my-team",
    defaultMothraTeamForBreakingCommit: "other-team",
  },
  tagValidation: {
    generatedTaskValidationPrefix: "prefix",
    trackGeneratedTaskTagValidation: true,
    blockTaskGenerationOnTagValidation: false,
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    id: "project",
    taskOwnership: {
      defaultMothraTeam: "my-team",
      defaultMothraTeamForBreakingCommit: "other-team",
      generatedTaskValidationPrefix: "prefix",
      trackGeneratedTaskTagValidation: true,
      blockTaskGenerationOnTagValidation: false,
    },
  },
};

const repoForm: TaskOwnershipAndFoliageFormState = {
  mothra: {
    defaultMothraTeam: "my-team",
    defaultMothraTeamForBreakingCommit: "other-team",
  },
  tagValidation: {
    generatedTaskValidationPrefix: "prefix",
    trackGeneratedTaskTagValidation: true,
    blockTaskGenerationOnTagValidation: false,
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef"> = {
  repoId: "repo",
  projectRef: {
    id: "repo",
    taskOwnership: {
      defaultMothraTeam: "my-team",
      defaultMothraTeamForBreakingCommit: "other-team",
      generatedTaskValidationPrefix: "prefix",
      trackGeneratedTaskTagValidation: true,
      blockTaskGenerationOnTagValidation: false,
    },
  },
};
