import { gql } from "@apollo/client";

export const USER_REPO_SETTINGS_PERMISSIONS = gql`
  query UserRepoSettingsPermissions($repoId: String!) {
    user {
      permissions {
        repoPermissions(options: { repoId: $repoId }) {
          edit
        }
      }
      userId
    }
  }
`;
