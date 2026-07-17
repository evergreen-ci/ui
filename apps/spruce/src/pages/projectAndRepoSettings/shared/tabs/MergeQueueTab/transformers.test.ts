import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType, alias } from "../utils";
import { formToGql, gqlToForm, mergeProjectRepo } from "./transformers";
import { MergeQueueFormState } from "./types";

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

const projectForm: MergeQueueFormState = {
  mergeQueue: {
    enabled: false,
    githubMQTriggerAliases: [],
    patchDefinitions: {
      mergeQueueAliases: [
        {
          alias: "__commit_queue",
          description: "",
          gitTag: "",
          id: "3",
          parameters: [],
          remotePath: "",
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: "^lint$",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: "^ubuntu1604$",
            variantTags: [],
          },
        },
      ],
      mergeQueueAliasesOverride: true,
    },
  },
};

const projectResult: Pick<
  ProjectSettingsInput,
  "projectId" | "projectRef" | "aliases"
> = {
  aliases: [
    {
      alias: "__commit_queue",
      description: "",
      gitTag: "",
      id: "3",
      parameters: [],
      remotePath: "",
      task: "^lint$",
      taskTags: [],
      variant: "^ubuntu1604$",
      variantTags: [],
    },
  ],
  projectId: "project",
  projectRef: {
    commitQueue: {
      enabled: false,
    },
    id: "project",
  },
};

const repoForm: MergeQueueFormState = {
  mergeQueue: {
    enabled: true,
    githubMQTriggerAliases: [
      {
        alias: "mq-alias",
        childProjectIdentifier: "spruce",
        parentAsModule: "",
        status: "success",
        taskSpecifiers: [
          {
            patchAlias: "alias2",
            taskRegex: "",
            variantRegex: "",
          },
          {
            patchAlias: "",
            taskRegex: ".*",
            variantRegex: ".*",
          },
        ],
      },
    ],
    patchDefinitions: {
      mergeQueueAliases: [],
      mergeQueueAliasesOverride: true,
    },
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef" | "aliases"> =
  {
    aliases: [],
    projectRef: {
      commitQueue: {
        enabled: true,
      },
      id: "repo",
    },
    repoId: "repo",
  };

const mergedForm: MergeQueueFormState = {
  mergeQueue: {
    enabled: false,
    githubMQTriggerAliases: [],
    patchDefinitions: {
      mergeQueueAliases: [
        {
          alias: "__commit_queue",
          description: "",
          gitTag: "",
          id: "3",
          parameters: [],
          remotePath: "",
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: "^lint$",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: "^ubuntu1604$",
            variantTags: [],
          },
        },
      ],
      mergeQueueAliasesOverride: true,
      repoData: {
        mergeQueueAliases: [],
        mergeQueueAliasesOverride: true,
      },
    },
  },
};
