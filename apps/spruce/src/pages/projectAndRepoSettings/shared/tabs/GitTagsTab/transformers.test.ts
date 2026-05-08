import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { alias, ProjectType } from "../utils";
import { formToGql, gqlToForm, mergeProjectRepo } from "./transformers";
import { GitTagsFormState } from "./types";

const { GitTagSpecifier, VariantTaskSpecifier } = alias;
const { projectBase, repoBase } = data;

describe("GitTagsTab transformers", () => {
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
        gqlToForm(projectBase, {
          projectType: ProjectType.AttachedProject,
        }),
      ).toStrictEqual(projectForm);
    });

    it("correctly converts from a form to GQL", () => {
      expect(formToGql(projectForm, false, "project")).toStrictEqual(
        projectResult,
      );
    });

    it("correctly merges project and repo form states", () => {
      expect(mergeProjectRepo(projectForm, repoForm)).toStrictEqual(mergedForm);
    });
  });
});

// Project-level git tags form state
const projectForm: GitTagsFormState = {
  github: {
    gitTagVersionsEnabled: null,
    users: {
      gitTagAuthorizedUsersOverride: true,
      gitTagAuthorizedUsers: ["privileged"],
    },
    teams: {
      gitTagAuthorizedTeamsOverride: true,
      gitTagAuthorizedTeams: [],
    },
    gitTags: {
      gitTagAliasesOverride: true,
      gitTagAliases: [
        {
          id: "5",
          alias: "__git_tag",
          description: "",
          specifier: GitTagSpecifier.ConfigFile,
          remotePath: "./evergreen.yml",
          gitTag: "tagName",
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: [],
          },
          parameters: [],
        },
      ],
    },
  },
};

const projectResult: Pick<
  ProjectSettingsInput,
  "projectId" | "projectRef" | "aliases"
> = {
  projectId: "project",
  projectRef: {
    id: "project",
    gitTagVersionsEnabled: null,
    gitTagAuthorizedUsers: ["privileged"],
    gitTagAuthorizedTeams: [],
  },
  aliases: [
    {
      id: "5",
      alias: "__git_tag",
      description: "",
      gitTag: "tagName",
      variant: "",
      task: "",
      remotePath: "./evergreen.yml",
      variantTags: [],
      taskTags: [],
      parameters: [],
    },
  ],
};

// Repo-level git tags form state
const repoForm: GitTagsFormState = {
  github: {
    gitTagVersionsEnabled: false,
    users: {
      gitTagAuthorizedUsersOverride: true,
      gitTagAuthorizedUsers: ["admin"],
    },
    teams: {
      gitTagAuthorizedTeamsOverride: true,
      gitTagAuthorizedTeams: [],
    },
    gitTags: {
      gitTagAliasesOverride: true,
      gitTagAliases: [],
    },
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef" | "aliases"> =
  {
    repoId: "repo",
    projectRef: {
      id: "repo",
      gitTagVersionsEnabled: false,
      gitTagAuthorizedUsers: ["admin"],
      gitTagAuthorizedTeams: [],
    },
    aliases: [],
  };

// Expected merged project+repo form state
const mergedForm: GitTagsFormState = {
  github: {
    gitTagVersionsEnabled: null,
    users: {
      gitTagAuthorizedUsersOverride: true,
      gitTagAuthorizedUsers: ["privileged"],
      repoData: {
        gitTagAuthorizedUsersOverride: true,
        gitTagAuthorizedUsers: ["admin"],
      },
    },
    teams: {
      gitTagAuthorizedTeamsOverride: true,
      gitTagAuthorizedTeams: [],
      repoData: {
        gitTagAuthorizedTeamsOverride: true,
        gitTagAuthorizedTeams: [],
      },
    },
    gitTags: {
      gitTagAliasesOverride: true,
      gitTagAliases: [
        {
          id: "5",
          alias: "__git_tag",
          description: "",
          specifier: GitTagSpecifier.ConfigFile,
          remotePath: "./evergreen.yml",
          gitTag: "tagName",
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: [],
          },
          parameters: [],
        },
      ],
      repoData: {
        gitTagAliasesOverride: true,
        gitTagAliases: [],
      },
    },
  },
};
