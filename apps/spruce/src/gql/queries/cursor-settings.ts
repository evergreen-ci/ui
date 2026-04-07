import { gql } from "@apollo/client";

export const CURSOR_SETTINGS = gql`
  query CursorSettings {
    cursorSettings {
      keyConfigured
      keyLastFour
    }
  }
`;
