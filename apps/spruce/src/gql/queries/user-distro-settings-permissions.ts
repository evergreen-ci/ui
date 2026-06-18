import { gql } from "@apollo/client";

export const USER_DISTRO_SETTINGS_PERMISSIONS = gql`
  query UserDistroSettingsPermissions($distroId: String!) {
    user: userLite {
      permissions {
        canCreateDistro
        distroPermissions(options: { distroId: $distroId }) {
          id: distroId
          admin
          edit
        }
      }
      userId: id
    }
  }
`;
