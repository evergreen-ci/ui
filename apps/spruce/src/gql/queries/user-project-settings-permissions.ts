import { gql } from "@apollo/client";

export const USER_PROJECT_SETTINGS_PERMISSIONS = gql`
  query UserProjectSettingsPermissions($projectIdentifier: String!) {
    user {
      permissions {
        canCreateProject
        projectPermissions(options: { projectIdentifier: $projectIdentifier }) {
          id: projectIdentifier
          edit
        }
      }
      userId
    }
  }
`;
