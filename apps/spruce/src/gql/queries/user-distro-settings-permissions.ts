import { gql } from "@apollo/client";

const USER_DISTRO_SETTINGS_PERMISSIONS = gql`
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

export default USER_DISTRO_SETTINGS_PERMISSIONS;
