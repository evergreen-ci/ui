import { gql } from "@apollo/client";

export const PARSLEY_SETTINGS = gql`
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
