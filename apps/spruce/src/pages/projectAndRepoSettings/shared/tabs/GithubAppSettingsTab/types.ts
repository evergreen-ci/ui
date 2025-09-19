import { GitHubDynamicTokenPermissionGroup } from "gql/generated/types";
import { ProjectType } from "../utils";

type AppCredentials = {
  githubAppAuth: {
    appId: number | null;
    privateKey: string;
  };
};

type TokenPermissionRestrictions = {
  permissionsByRequester: {
    requesterType: string;
    permissionGroup: string;
  }[];
};

export interface AppSettingsFormState {
  appCredentials: AppCredentials;
  tokenPermissionRestrictions: TokenPermissionRestrictions;
  repoData?: {
    appCredentials: AppCredentials;
    tokenPermissionRestrictions: TokenPermissionRestrictions;
  };
}

export type TabProps = {
  identifier: string;
  repoId: string;
  githubPermissionGroups: GitHubDynamicTokenPermissionGroup[];
  projectData?: AppSettingsFormState;
  projectId: string;
  projectType: ProjectType;
  repoData?: AppSettingsFormState;
};
