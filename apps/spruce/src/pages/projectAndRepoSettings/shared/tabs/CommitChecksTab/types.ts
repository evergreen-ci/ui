import { GithubProjectConflicts } from "gql/generated/types";
import { AliasFormType, ProjectType } from "../utils";

export interface CommitChecksFormState {
  github: {
    githubChecksEnabled: boolean | null;
    githubChecks: {
      githubCheckAliasesOverride: boolean;
      githubCheckAliases: Array<AliasFormType>;
      repoData?: {
        githubCheckAliasesOverride: boolean;
        githubCheckAliases: Array<AliasFormType>;
      };
    };
  };
}

export type TabProps = {
  githubWebhooksEnabled: boolean;
  identifier: string;
  projectData?: CommitChecksFormState;
  projectId: string;
  projectType: ProjectType;
  repoData?: CommitChecksFormState;
  versionControlEnabled: boolean;
  githubProjectConflicts?: GithubProjectConflicts;
};
