import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { TaskLevelTestSelection, TestSelectionFormState } from "./types";

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
      expected: TaskLevelTestSelection.Disabled,
      mainlineDefaultEnabled: false,
    },
    {
      defaultEnabled: true,
      expected: TaskLevelTestSelection.Patches,
      mainlineDefaultEnabled: false,
    },
    {
      defaultEnabled: true,
      expected: TaskLevelTestSelection.PatchesAndMainline,
      mainlineDefaultEnabled: true,
    },
  ])(
    "converts defaultEnabled=$defaultEnabled and mainlineDefaultEnabled=$mainlineDefaultEnabled from GQL",
    ({ defaultEnabled, expected, mainlineDefaultEnabled }) => {
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
      ).toMatchObject({ taskLevel: expected });
    },
  );

  it.each([
    {
      defaultEnabled: false,
      mainlineDefaultEnabled: false,
      taskLevel: TaskLevelTestSelection.Disabled,
    },
    {
      defaultEnabled: true,
      mainlineDefaultEnabled: false,
      taskLevel: TaskLevelTestSelection.Patches,
    },
    {
      defaultEnabled: true,
      mainlineDefaultEnabled: true,
      taskLevel: TaskLevelTestSelection.PatchesAndMainline,
    },
  ])(
    "converts $taskLevel to GQL",
    ({ defaultEnabled, mainlineDefaultEnabled, taskLevel }) => {
      expect(
        formToGql({ allowed: true, taskLevel }, false, "project").projectRef
          .testSelection,
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
  taskLevel: null,
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
  taskLevel: TaskLevelTestSelection.PatchesAndMainline,
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
