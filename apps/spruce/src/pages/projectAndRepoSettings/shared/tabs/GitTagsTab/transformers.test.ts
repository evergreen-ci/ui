import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType, alias } from "../utils";
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
    gitTags: {
      gitTagAliases: [
        {
          alias: "__git_tag",
          description: "",
          gitTag: "tagName",
          id: "5",
          parameters: [],
          remotePath: "./evergreen.yml",
          specifier: GitTagSpecifier.ConfigFile,
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: [],
          },
        },
      ],
      gitTagAliasesOverride: true,
    },
    gitTagVersionsEnabled: null,
    teams: {
      gitTagAuthorizedTeams: [],
      gitTagAuthorizedTeamsOverride: true,
    },
    users: {
      gitTagAuthorizedUsers: ["privileged"],
      gitTagAuthorizedUsersOverride: true,
    },
  },
};

const projectResult: Pick<
  ProjectSettingsInput,
  "projectId" | "projectRef" | "aliases"
> = {
  aliases: [
    {
      alias: "__git_tag",
      description: "",
      gitTag: "tagName",
      id: "5",
      parameters: [],
      remotePath: "./evergreen.yml",
      task: "",
      taskTags: [],
      variant: "",
      variantTags: [],
    },
  ],
  projectId: "project",
  projectRef: {
    gitTagAuthorizedTeams: [],
    gitTagAuthorizedUsers: ["privileged"],
    gitTagVersionsEnabled: null,
    id: "project",
  },
};

// Repo-level git tags form state
const repoForm: GitTagsFormState = {
  github: {
    gitTags: {
      gitTagAliases: [],
      gitTagAliasesOverride: true,
    },
    gitTagVersionsEnabled: false,
    teams: {
      gitTagAuthorizedTeams: [],
      gitTagAuthorizedTeamsOverride: true,
    },
    users: {
      gitTagAuthorizedUsers: ["admin"],
      gitTagAuthorizedUsersOverride: true,
    },
  },
};

const repoResult: Pick<RepoSettingsInput, "repoId" | "projectRef" | "aliases"> =
  {
    aliases: [],
    projectRef: {
      gitTagAuthorizedTeams: [],
      gitTagAuthorizedUsers: ["admin"],
      gitTagVersionsEnabled: false,
      id: "repo",
    },
    repoId: "repo",
  };

// Expected merged project+repo form state
const mergedForm: GitTagsFormState = {
  github: {
    gitTags: {
      gitTagAliases: [
        {
          alias: "__git_tag",
          description: "",
          gitTag: "tagName",
          id: "5",
          parameters: [],
          remotePath: "./evergreen.yml",
          specifier: GitTagSpecifier.ConfigFile,
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: [],
          },
        },
      ],
      gitTagAliasesOverride: true,
      repoData: {
        gitTagAliases: [],
        gitTagAliasesOverride: true,
      },
    },
    gitTagVersionsEnabled: null,
    teams: {
      gitTagAuthorizedTeams: [],
      gitTagAuthorizedTeamsOverride: true,
      repoData: {
        gitTagAuthorizedTeams: [],
        gitTagAuthorizedTeamsOverride: true,
      },
    },
    users: {
      gitTagAuthorizedUsers: ["privileged"],
      gitTagAuthorizedUsersOverride: true,
      repoData: {
        gitTagAuthorizedUsers: ["admin"],
        gitTagAuthorizedUsersOverride: true,
      },
    },
  },
};
