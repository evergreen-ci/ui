import { gql } from "@apollo/client";

export const RESET_USER_API_KEY = gql`
  mutation ResetUserAPIKey {
    resetAPIKey {
      api_key
      user
    }
  }
`;
