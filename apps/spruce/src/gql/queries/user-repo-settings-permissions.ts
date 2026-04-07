import { gql } from "@apollo/client";

const USER_REPO_SETTINGS_PERMISSIONS = gql`
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

export default USER_REPO_SETTINGS_PERMISSIONS;
