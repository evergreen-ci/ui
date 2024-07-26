import { GitHubDynamicTokenPermissionGroup } from "gql/generated/types";

export interface AppSettingsFormState {
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
};
