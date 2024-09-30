import { ProjectPatchAliasSettingsFragment } from "gql/generated/types";
import { AliasFormType, ProjectType } from "../utils";

export interface GCQFormState {
  github: {
    prTestingEnabled: boolean | null;
    manualPrTestingEnabled: boolean | null;
    prTesting: {
      githubPrAliasesOverride: boolean;
      githubPrAliases: Array<AliasFormType>;
      repoData?: {
        githubPrAliasesOverride: boolean;
        githubPrAliases: Array<AliasFormType>;
      };
    };
    oldestAllowedMergeBase: string;
    githubTriggerAliases: ProjectPatchAliasSettingsFragment["patchTriggerAliases"];
    githubChecksEnabled: boolean;
    githubChecks: {
      githubCheckAliasesOverride: boolean;
      githubCheckAliases: Array<AliasFormType>;
      repoData?: {
        githubCheckAliasesOverride: boolean;
        githubCheckAliases: Array<AliasFormType>;
      };
    };
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
  mergeQueue: {
    enabled: boolean | null;
    patchDefinitions: {
      mergeQueueAliasesOverride: boolean;
      mergeQueueAliases: Array<AliasFormType>;
      repoData?: {
        mergeQueueAliasesOverride: boolean;
        mergeQueueAliases: Array<AliasFormType>;
      };
    };
  };
}

export type TabProps = {
  githubWebhooksEnabled: boolean;
  identifier: string;
  projectData?: GCQFormState;
  projectId: string;
  projectType: ProjectType;
  repoData?: GCQFormState;
  versionControlEnabled: boolean;
};
