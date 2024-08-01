import { GitHubDynamicTokenPermissionGroup } from "gql/generated/types";

export interface AppSettingsFormState {
  appCredentials: {
    githubAppAuth: {
      appId: number;
      privateKey: string;
    };
  };
  tokenPermissionRestrictions: {
    permissionsByRequester: {
      requesterType: string;
      permissionGroup: string;
    }[];
  };
}

export type TabProps = {
  identifier: string;
  githubPermissionGroups: GitHubDynamicTokenPermissionGroup[];
  projectData: AppSettingsFormState;
  projectId: string;
};
