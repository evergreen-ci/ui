import { gql } from "@apollo/client";

const DELETE_CURSOR_API_KEY = gql`
  mutation DeleteCursorAPIKey {
    deleteCursorAPIKey {
      success
    }
  }
`;

export default DELETE_CURSOR_API_KEY;
