import { gql } from "@apollo/client";

const UPDATE_PARSLEY_SETTINGS = gql`
  mutation UpdateParsleySettings($opts: UpdateParsleySettingsInput!) {
    updateParsleySettings(opts: $opts) {
      parsleySettings {
        jumpToFailingLineEnabled
        sectionsEnabled
      }
    }
  }
`;

export default UPDATE_PARSLEY_SETTINGS;
