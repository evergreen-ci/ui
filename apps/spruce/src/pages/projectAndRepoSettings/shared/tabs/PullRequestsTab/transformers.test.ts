import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { alias, ProjectType } from "../utils";
import { formToGql, gqlToForm, mergeProjectRepo } from "./transformers";
import { PullRequestsFormState } from "./types";

const { VariantTaskSpecifier } = alias;
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
    expect(
      gqlToForm(projectBase, { projectType: ProjectType.AttachedProject }),
    ).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL and omits empty strings", () => {
    expect(formToGql(projectForm, false, "project")).toStrictEqual(
      projectResult,
    );
  });

  it("correctly merges project and repo form states", () => {
    expect(mergeProjectRepo(projectForm, repoForm)).toStrictEqual(mergedForm);
  });
});

const projectForm: PullRequestsFormState = {
  github: {
    prTestingEnabled: null,
    manualPrTestingEnabled: null,
    oldestAllowedMergeBase: "abc",
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [
        {
          id: "1",
          alias: "__github",
          description: "",
          gitTag: "",
          remotePath: "",
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: ".*",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: ".*",
            taskTags: [],
          },
          parameters: [],
        },
      ],
    },
    githubPRTriggerAliases: [],
  },
};

const projectResult: Pick<
  ProjectSettingsInput,
  "projectId" | "projectRef" | "aliases"
> = {
  projectId: "project",
  projectRef: {
    id: "project",
    prTestingEnabled: null,
    manualPrTestingEnabled: null,
    oldestAllowedMergeBase: "abc",
  },
  aliases: [
    {
      id: "1",
      alias: "__github",
      description: "",
      gitTag: "",
      remotePath: "",
      task: ".*",
      taskTags: [],
      variant: ".*",
      variantTags: [],
      parameters: [],
    },
  ],
};

const repoForm: PullRequestsFormState = {
  github: {
    prTestingEnabled: false,
    manualPrTestingEnabled: false,
    oldestAllowedMergeBase: "abc",
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [],
    },
    githubPRTriggerAliases: [
      {
        alias: "alias1",
        childProjectIdentifier: "spruce",
        taskSpecifiers: [
          { patchAlias: "alias2", taskRegex: "", variantRegex: "" },
          { patchAlias: "", taskRegex: ".*", variantRegex: ".*" },
        ],
        status: "success",
        parentAsModule: "",
      },
    ],
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef" | "aliases"> =
  {
    repoId: "repo",
    projectRef: {
      id: "repo",
      prTestingEnabled: false,
      manualPrTestingEnabled: false,
      oldestAllowedMergeBase: "abc",
    },
    aliases: [],
  };

const mergedForm: PullRequestsFormState = {
  github: {
    prTestingEnabled: null,
    manualPrTestingEnabled: null,
    oldestAllowedMergeBase: "abc",
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [
        {
          id: "1",
          alias: "__github",
          description: "",
          gitTag: "",
          remotePath: "",
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: ".*",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: ".*",
            taskTags: [],
          },
          parameters: [],
        },
      ],
      repoData: {
        githubPrAliasesOverride: true,
        githubPrAliases: [],
      },
    },
    githubPRTriggerAliases: [],
  },
};
