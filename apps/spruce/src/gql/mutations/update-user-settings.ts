import { gql } from "@apollo/client";

const UPDATE_USER_SETTINGS = gql`
  mutation UpdateUserSettings($userSettings: UserSettingsInput!) {
    updateUserSettings(userSettings: $userSettings)
  }
`;

export default UPDATE_USER_SETTINGS;
