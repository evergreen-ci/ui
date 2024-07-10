export interface PermissionGroupsFormState {
  permissionGroups: {
    displayTitle: string;
    name: string;
    permissions: {
      type: string;
      value: string;
    }[];
  }[];
}

export type TabProps = {
  projectData: PermissionGroupsFormState;
};
