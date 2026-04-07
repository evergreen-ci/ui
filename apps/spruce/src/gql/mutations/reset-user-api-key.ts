import { gql } from "@apollo/client";

const RESET_USER_API_KEY = gql`
  mutation ResetUserAPIKey {
    resetAPIKey {
      api_key
      user
    }
  }
`;

export default RESET_USER_API_KEY;
