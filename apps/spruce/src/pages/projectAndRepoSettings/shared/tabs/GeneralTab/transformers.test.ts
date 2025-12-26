import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { GeneralFormState } from "./types";

const { projectBase, repoBase } = data;

describe("repo data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(repoBase, { projectType: ProjectType.Repo }),
    ).toStrictEqual(repoForm);
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

const repoForm: GeneralFormState = {
  generalConfiguration: {
    repositoryInfo: {
      owner: "evergreen-ci",
      repo: "spruce",
    },
    other: {
      displayName: "",
      batchTime: 12,
      remotePath: "evergreen.yml",
      spawnHostScriptPath: "/test/path",
      versionControlEnabled: false,
    },
  },
  projectFlags: {
    dispatchingDisabled: true,
    debugSpawnHostsDisabled: false,
    scheduling: {
      deactivatePrevious: true,
      stepbackDisabled: true,
      stepbackBisection: true,
      deactivateStepback: null,
    },
    repotracker: {
      repotrackerDisabled: false,
      forceRun: null,
    },
    patch: {
      patchingDisabled: false,
    },
  },
  historicalTaskDataCaching: {
    disabledStatsCache: false,
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef"> = {
  repoId: "repo",
  projectRef: {
    id: "repo",
    owner: "evergreen-ci",
    repo: "spruce",
    displayName: "",
    batchTime: 12,
    remotePath: "evergreen.yml",
    spawnHostScriptPath: "/test/path",
    versionControlEnabled: false,
    dispatchingDisabled: true,
    deactivatePrevious: true,
    repotrackerDisabled: false,
    debugSpawnHostsDisabled: false,
    patchingDisabled: false,
    stepbackDisabled: true,
    stepbackBisect: true,
    disabledStatsCache: false,
  },
};

const projectForm: GeneralFormState = {
  generalConfiguration: {
    enabled: false,
    repositoryInfo: {
      owner: "evergreen-ci",
      repo: "evergreen",
    },
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    branch: null,
    other: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      displayName: null,
      projectID: "projectid",
      identifier: "project",
      batchTime: 0,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      remotePath: null,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      spawnHostScriptPath: null,
      versionControlEnabled: true,
    },
  },
  projectFlags: {
    dispatchingDisabled: null,
    debugSpawnHostsDisabled: null,
    scheduling: {
      deactivatePrevious: null,
      stepbackDisabled: null,
      stepbackBisection: null,
      deactivateStepback: null,
    },
    repotracker: {
      repotrackerDisabled: null,
      forceRun: null,
    },
    patch: {
      patchingDisabled: null,
    },
  },
  historicalTaskDataCaching: {
    disabledStatsCache: null,
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    id: "project",
    enabled: false,
    owner: "evergreen-ci",
    repo: "evergreen",
    branch: null,
    displayName: null,
    identifier: "project",
    batchTime: 0,
    remotePath: null,
    spawnHostScriptPath: null,
    versionControlEnabled: true,
    dispatchingDisabled: null,
    deactivatePrevious: null,
    repotrackerDisabled: null,
    debugSpawnHostsDisabled: null,
    patchingDisabled: null,
    stepbackDisabled: null,
    stepbackBisect: null,
    disabledStatsCache: null,
  },
};
