import { gql } from "@apollo/client";

export const DELETE_CURSOR_API_KEY = gql`
  mutation DeleteCursorAPIKey {
    deleteCursorAPIKey {
      success
    }
  }
`;
