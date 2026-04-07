import { gql } from "@apollo/client";

const PARSLEY_SETTINGS = gql`
  query ParsleySettings {
    user {
      parsleySettings {
        jumpToFailingLineEnabled
        sectionsEnabled
      }
      userId
    }
  }
`;

export default PARSLEY_SETTINGS;
