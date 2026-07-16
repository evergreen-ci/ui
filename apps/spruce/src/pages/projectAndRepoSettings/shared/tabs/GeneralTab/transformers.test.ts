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
    other: {
      batchTime: 12,
      displayName: "",
      remotePath: "evergreen.yml",
      spawnHostScriptPath: "/test/path",
      versionControlEnabled: false,
    },
    repositoryInfo: {
      owner: "evergreen-ci",
      repo: "spruce",
    },
  },
  historicalTaskDataCaching: {
    disabledStatsCache: false,
  },
  projectFlags: {
    debug: {
      debugSpawnHostsDisabled: false,
    },
    dispatchingDisabled: true,
    patch: {
      patchingDisabled: false,
    },
    repotracker: {
      forceRun: null,
      repotrackerDisabled: false,
      runEveryMainlineCommit: false,
      waterfallDisabled: false,
    },
    scheduling: {
      deactivatePrevious: true,
      deactivateStepback: null,
      stepbackBisection: true,
      stepbackDisabled: true,
    },
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef"> = {
  projectRef: {
    batchTime: 12,
    deactivatePrevious: true,
    debugSpawnHostsDisabled: false,
    disabledStatsCache: false,
    dispatchingDisabled: true,
    displayName: "",
    id: "repo",
    owner: "evergreen-ci",
    patchingDisabled: false,
    remotePath: "evergreen.yml",
    repo: "spruce",
    repotrackerDisabled: false,
    runEveryMainlineCommit: false,
    spawnHostScriptPath: "/test/path",
    stepbackBisect: true,
    stepbackDisabled: true,
    versionControlEnabled: false,
    waterfallDisabled: false,
  },
  repoId: "repo",
};

const projectForm: GeneralFormState = {
  generalConfiguration: {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    branch: null,
    enabled: false,
    other: {
      batchTime: 0,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      displayName: null,
      identifier: "project",
      projectID: "projectid",
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      remotePath: null,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      spawnHostScriptPath: null,
      versionControlEnabled: true,
    },
    repositoryInfo: {
      owner: "evergreen-ci",
      repo: "evergreen",
    },
  },
  historicalTaskDataCaching: {
    disabledStatsCache: null,
  },
  projectFlags: {
    debug: {
      debugSpawnHostsDisabled: null,
    },
    dispatchingDisabled: null,
    patch: {
      patchingDisabled: null,
    },
    repotracker: {
      forceRun: null,
      repotrackerDisabled: null,
      runEveryMainlineCommit: null,
      waterfallDisabled: null,
    },
    scheduling: {
      deactivatePrevious: null,
      deactivateStepback: null,
      stepbackBisection: null,
      stepbackDisabled: null,
    },
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectId" | "projectRef"> = {
  projectId: "project",
  projectRef: {
    batchTime: 0,
    branch: null,
    deactivatePrevious: null,
    debugSpawnHostsDisabled: null,
    disabledStatsCache: null,
    dispatchingDisabled: null,
    displayName: null,
    enabled: false,
    id: "project",
    identifier: "project",
    owner: "evergreen-ci",
    patchingDisabled: null,
    remotePath: null,
    repo: "evergreen",
    repotrackerDisabled: null,
    runEveryMainlineCommit: null,
    spawnHostScriptPath: null,
    stepbackBisect: null,
    stepbackDisabled: null,
    versionControlEnabled: true,
    waterfallDisabled: null,
  },
};
