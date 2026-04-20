import { gql } from "@apollo/client";

export const USER = gql`
  query User {
    user {
      displayName
      emailAddress
      permissions {
        canEditAdminSettings
      }
      userId
    }
  }
`;
