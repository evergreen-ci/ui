import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { alias, ProjectType } from "../utils";
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
    patchDefinitions: {
      mergeQueueAliasesOverride: true,
      mergeQueueAliases: [
        {
          id: "3",
          alias: "__commit_queue",
          description: "",
          gitTag: "",
          remotePath: "",
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: "^ubuntu1604$",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: "^lint$",
            taskTags: [],
          },
          parameters: [],
        },
      ],
    },
    githubMQTriggerAliases: [],
  },
};

const projectResult: Pick<
  ProjectSettingsInput,
  "projectId" | "projectRef" | "aliases"
> = {
  projectId: "project",
  projectRef: {
    id: "project",
    commitQueue: {
      enabled: false,
    },
  },
  aliases: [
    {
      id: "3",
      alias: "__commit_queue",
      description: "",
      gitTag: "",
      variant: "^ubuntu1604$",
      task: "^lint$",
      remotePath: "",
      variantTags: [],
      taskTags: [],
      parameters: [],
    },
  ],
};

const repoForm: MergeQueueFormState = {
  mergeQueue: {
    enabled: true,
    patchDefinitions: {
      mergeQueueAliasesOverride: true,
      mergeQueueAliases: [],
    },
    githubMQTriggerAliases: [
      {
        alias: "mq-alias",
        childProjectIdentifier: "spruce",
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
      commitQueue: {
        enabled: true,
      },
    },
    aliases: [],
  };

const mergedForm: MergeQueueFormState = {
  mergeQueue: {
    enabled: false,
    patchDefinitions: {
      mergeQueueAliasesOverride: true,
      mergeQueueAliases: [
        {
          id: "3",
          alias: "__commit_queue",
          description: "",
          gitTag: "",
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: "^ubuntu1604$",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: "^lint$",
            taskTags: [],
          },
          remotePath: "",
          parameters: [],
        },
      ],
      repoData: {
        mergeQueueAliasesOverride: true,
        mergeQueueAliases: [],
      },
    },
    githubMQTriggerAliases: [],
  },
};
