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
    githubPRTriggerAliases: [],
    manualPrTestingEnabled: null,
    oldestAllowedMergeBase: "abc",
    prTesting: {
      githubPrAliases: [
        {
          alias: "__github",
          description: "",
          gitTag: "",
          id: "1",
          parameters: [],
          remotePath: "",
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: ".*",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: ".*",
            variantTags: [],
          },
        },
      ],
      githubPrAliasesOverride: true,
    },
    prTestingEnabled: null,
  },
};

const projectResult: Pick<
  ProjectSettingsInput,
  "projectId" | "projectRef" | "aliases"
> = {
  aliases: [
    {
      alias: "__github",
      description: "",
      gitTag: "",
      id: "1",
      parameters: [],
      remotePath: "",
      task: ".*",
      taskTags: [],
      variant: ".*",
      variantTags: [],
    },
  ],
  projectId: "project",
  projectRef: {
    id: "project",
    manualPrTestingEnabled: null,
    oldestAllowedMergeBase: "abc",
    prTestingEnabled: null,
  },
};

const repoForm: PullRequestsFormState = {
  github: {
    githubPRTriggerAliases: [
      {
        alias: "alias1",
        childProjectIdentifier: "spruce",
        parentAsModule: "",
        status: "success",
        taskSpecifiers: [
          { patchAlias: "alias2", taskRegex: "", variantRegex: "" },
          { patchAlias: "", taskRegex: ".*", variantRegex: ".*" },
        ],
      },
    ],
    manualPrTestingEnabled: false,
    oldestAllowedMergeBase: "abc",
    prTesting: {
      githubPrAliases: [],
      githubPrAliasesOverride: true,
    },
    prTestingEnabled: false,
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef" | "aliases"> =
  {
    aliases: [],
    projectRef: {
      id: "repo",
      manualPrTestingEnabled: false,
      oldestAllowedMergeBase: "abc",
      prTestingEnabled: false,
    },
    repoId: "repo",
  };

const mergedForm: PullRequestsFormState = {
  github: {
    githubPRTriggerAliases: [],
    manualPrTestingEnabled: null,
    oldestAllowedMergeBase: "abc",
    prTesting: {
      githubPrAliases: [
        {
          alias: "__github",
          description: "",
          gitTag: "",
          id: "1",
          parameters: [],
          remotePath: "",
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: ".*",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: ".*",
            variantTags: [],
          },
        },
      ],
      githubPrAliasesOverride: true,
      repoData: {
        githubPrAliases: [],
        githubPrAliasesOverride: true,
      },
    },
    prTestingEnabled: null,
  },
};
