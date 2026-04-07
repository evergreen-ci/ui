import { gql } from "@apollo/client";

export const USER_DISTRO_SETTINGS_PERMISSIONS = gql`
  query UserDistroSettingsPermissions($distroId: String!) {
    user {
      permissions {
        canCreateDistro
        distroPermissions(options: { distroId: $distroId }) {
          admin
          edit
        }
      }
      userId
    }
  }
`;
