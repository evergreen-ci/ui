import { gql } from "@apollo/client";

const USER_PROJECT_SETTINGS_PERMISSIONS = gql`
  query UserProjectSettingsPermissions($projectIdentifier: String!) {
    user {
      permissions {
        canCreateProject
        projectPermissions(options: { projectIdentifier: $projectIdentifier }) {
          edit
        }
      }
      userId
    }
  }
`;

export default USER_PROJECT_SETTINGS_PERMISSIONS;
