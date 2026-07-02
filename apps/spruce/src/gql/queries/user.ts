import { gql } from "@apollo/client";

export const USER = gql`
  query User {
    user: userLite {
      displayName
      emailAddress
      permissions {
        canEditAdminSettings
      }
      userId: id
    }
  }
`;
