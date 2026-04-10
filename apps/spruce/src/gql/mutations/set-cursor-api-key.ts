import { gql } from "@apollo/client";

export const SET_CURSOR_API_KEY = gql`
  mutation SetCursorAPIKey($apiKey: String!) {
    setCursorAPIKey(apiKey: $apiKey) {
      keyLastFour
      success
    }
  }
`;
