import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { alias, ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { PatchAliasesFormState, TaskSpecifier } from "./types";

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
});

const projectForm: PatchAliasesFormState = {
  patchAliases: {
    aliasesOverride: false,
    aliases: [],
  },
  patchTriggerAliases: {
    aliasesOverride: false,
    aliases: [],
  },
};

const projectResult: Pick<
  ProjectSettingsInput,
  "projectId" | "projectRef" | "aliases"
> = {
  projectId: "project",
  projectRef: {
    id: "project",
    patchTriggerAliases: null,
    githubPRTriggerAliases: [],
  },
  aliases: [],
};

const repoForm: PatchAliasesFormState = {
  patchAliases: {
    aliasesOverride: true,
    aliases: [
      {
        id: "4",
        alias: "my alias name",
        description: "my description",
        displayTitle: "my alias name",
        gitTag: "",
        remotePath: "",
        variants: {
          specifier: VariantTaskSpecifier.Tags,
          variant: "",
          variantTags: ["okay"],
        },
        tasks: {
          specifier: VariantTaskSpecifier.Tags,
          task: "",
          taskTags: ["hi"],
        },
        parameters: [],
      },
    ],
  },
  patchTriggerAliases: {
    aliasesOverride: true,
    aliases: [
      {
        alias: "alias1",
        childProjectIdentifier: "spruce",
        downstreamRevision: "",
        status: "success",
        displayTitle: "alias1",
        parentAsModule: "",
        isGithubTriggerAlias: true,
        taskSpecifiers: [
          {
            specifier: TaskSpecifier.PatchAlias,
            patchAlias: "alias2",
            taskRegex: "",
            variantRegex: "",
          },
          {
            specifier: TaskSpecifier.VariantTask,
            patchAlias: "",
            taskRegex: ".*",
            variantRegex: ".*",
          },
        ],
      },
    ],
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef" | "aliases"> =
  {
    repoId: "repo",
    projectRef: {
      id: "repo",
      patchTriggerAliases: [
        {
          alias: "alias1",
          childProjectIdentifier: "spruce",
          downstreamRevision: "",
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
      githubPRTriggerAliases: ["alias1"],
    },
    aliases: [
      {
        id: "4",
        alias: "my alias name",
        description: "my description",
        gitTag: "",
        variant: "",
        task: "",
        remotePath: "",
        parameters: [],
        variantTags: ["okay"],
        taskTags: ["hi"],
      },
    ],
  };
