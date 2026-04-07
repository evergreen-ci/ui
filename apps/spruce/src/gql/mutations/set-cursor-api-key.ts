import { gql } from "@apollo/client";

const SET_CURSOR_API_KEY = gql`
  mutation SetCursorAPIKey($apiKey: String!) {
    setCursorAPIKey(apiKey: $apiKey) {
      keyLastFour
      success
    }
  }
`;

export default SET_CURSOR_API_KEY;
