import { gql } from "@apollo/client";

export const UPDATE_PARSLEY_SETTINGS = gql`
  mutation UpdateParsleySettings($opts: UpdateParsleySettingsInput!) {
    updateParsleySettings(opts: $opts) {
      parsleySettings {
        jumpToFailingLineEnabled
        sectionsEnabled
      }
    }
  }
`;
