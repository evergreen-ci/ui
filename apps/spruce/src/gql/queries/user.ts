import { gql } from "@apollo/client";

const USER = gql`
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

export default USER;
