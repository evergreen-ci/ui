import { ProjectPatchAliasSettingsFragment } from "gql/generated/types";
import { AliasFormType, ProjectType } from "../utils";

export interface PullRequestsFormState {
  github: {
    prTestingEnabled: boolean | null | undefined;
    manualPrTestingEnabled: boolean | null | undefined;
    prTesting: {
      githubPrAliasesOverride: boolean;
      githubPrAliases: Array<AliasFormType>;
      repoData?: {
        githubPrAliasesOverride: boolean;
        githubPrAliases: Array<AliasFormType>;
      };
    };
    oldestAllowedMergeBase: string;
    githubPRTriggerAliases: ProjectPatchAliasSettingsFragment["patchTriggerAliases"];
  };
}

export type TabProps = {
  githubWebhooksEnabled: boolean;
  projectData?: PullRequestsFormState;
  projectId: string;
  projectType: ProjectType;
  repoData?: PullRequestsFormState;
  versionControlEnabled: boolean;
};
