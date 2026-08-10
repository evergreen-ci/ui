import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { TestSelectionFormState } from "./types";

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

describe("task-level settings", () => {
  it.each([
    {
      defaultEnabled: false,
      mainlineDefaultEnabled: false,
    },
    {
      defaultEnabled: true,
      mainlineDefaultEnabled: false,
    },
    {
      defaultEnabled: true,
      mainlineDefaultEnabled: true,
    },
  ])(
    "converts defaultEnabled=$defaultEnabled and mainlineDefaultEnabled=$mainlineDefaultEnabled from GQL",
    ({ defaultEnabled, mainlineDefaultEnabled }) => {
      const projectRef = repoBase.projectRef!;
      expect(
        gqlToForm({
          ...repoBase,
          projectRef: {
            ...projectRef,
            testSelection: {
              allowed: true,
              defaultEnabled,
              mainlineDefaultEnabled,
            },
          },
        }),
      ).toMatchObject({ defaultEnabled, mainlineDefaultEnabled });
    },
  );

  it.each([
    {
      defaultEnabled: false,
      mainlineDefaultEnabled: false,
    },
    {
      defaultEnabled: true,
      mainlineDefaultEnabled: false,
    },
    {
      defaultEnabled: true,
      mainlineDefaultEnabled: true,
    },
  ])(
    "converts test selection settings to GQL",
    ({ defaultEnabled, mainlineDefaultEnabled }) => {
      expect(
        formToGql(
          { allowed: true, defaultEnabled, mainlineDefaultEnabled },
          false,
          "project",
        ).projectRef.testSelection,
      ).toStrictEqual({
        allowed: true,
        defaultEnabled,
        mainlineDefaultEnabled,
      });
    },
  );
});

const projectForm: TestSelectionFormState = {
  allowed: null,
  defaultEnabled: null,
  mainlineDefaultEnabled: null,
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    id: "project",
    testSelection: {
      allowed: null,
      defaultEnabled: null,
      mainlineDefaultEnabled: null,
    },
  },
};

const repoForm: TestSelectionFormState = {
  allowed: true,
  defaultEnabled: true,
  mainlineDefaultEnabled: true,
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef"> = {
  repoId: "repo",
  projectRef: {
    id: "repo",
    testSelection: {
      allowed: true,
      defaultEnabled: true,
      mainlineDefaultEnabled: true,
    },
  },
};
