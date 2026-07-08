import {
  GithubProjectConflicts,
  ProjectPatchAliasSettingsFragment,
} from "gql/generated/types";
import { AliasFormType, ProjectType } from "../utils";

export interface MergeQueueFormState {
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
    githubMQTriggerAliases: ProjectPatchAliasSettingsFragment["patchTriggerAliases"];
  };
}

export type TabProps = {
  githubWebhooksEnabled: boolean;
  identifier: string;
  projectData?: MergeQueueFormState;
  projectId: string;
  projectType: ProjectType;
  repoData?: MergeQueueFormState;
  versionControlEnabled: boolean;
  githubProjectConflicts?: GithubProjectConflicts;
};
