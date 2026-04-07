import { gql } from "@apollo/client";

const CURSOR_SETTINGS = gql`
  query CursorSettings {
    cursorSettings {
      keyConfigured
      keyLastFour
    }
  }
`;

export default CURSOR_SETTINGS;
