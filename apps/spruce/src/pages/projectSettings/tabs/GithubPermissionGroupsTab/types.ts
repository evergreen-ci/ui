import { ProjectType } from "../utils";

type PermissionGroups = {
  displayTitle: string;
  name: string;
  permissions: {
    type: string;
    value: string;
  }[];
}[];

type AppCredentials = {
  githubAppAuth: {
    appId: number;
    privateKey: string;
  };
};

export interface PermissionGroupsFormState {
  appCredentials: AppCredentials;
  permissionGroups: PermissionGroups;
  repoData?: {
    appCredentials: AppCredentials;
    permissionGroups: PermissionGroups;
  };
}

export type TabProps = {
  identifier: string;
  repoId: string;
  projectData?: PermissionGroupsFormState;
  projectType: ProjectType;
  repoData?: PermissionGroupsFormState;
};
