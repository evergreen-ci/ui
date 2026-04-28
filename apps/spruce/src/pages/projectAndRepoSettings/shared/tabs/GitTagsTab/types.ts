import { AliasFormType, ProjectType } from "../utils";

export interface GitTagsFormState {
  github: {
    gitTagVersionsEnabled: boolean | null;
    users: {
      gitTagAuthorizedUsersOverride: boolean;
      gitTagAuthorizedUsers: Array<string> | null;
      repoData?: {
        gitTagAuthorizedUsersOverride: boolean;
        gitTagAuthorizedUsers: Array<string> | null;
      };
    };
    teams: {
      gitTagAuthorizedTeamsOverride: boolean;
      gitTagAuthorizedTeams: Array<string> | null;
      repoData?: {
        gitTagAuthorizedTeamsOverride: boolean;
        gitTagAuthorizedTeams: Array<string> | null;
      };
    };
    gitTags: {
      gitTagAliasesOverride: boolean;
      gitTagAliases: Array<AliasFormType>;
      repoData?: {
        gitTagAliasesOverride: boolean;
        gitTagAliases: Array<AliasFormType>;
      };
    };
  };
}

export type TabProps = {
  githubWebhooksEnabled: boolean;
  projectData?: GitTagsFormState;
  projectType: ProjectType;
  repoData?: GitTagsFormState;
  versionControlEnabled: boolean;
};
