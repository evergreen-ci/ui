import { gql } from "@apollo/client";
import { PROJECT_BUILD_BARON_SETTINGS_FRAGMENT } from "../fragments/projectBuildBaronSettings";

export const PROJECT_BUILD_BARON_SETTINGS = gql`
  query ProjectBuildBaronSettings($projectIdentifier: String!) {
    project(projectIdentifier: $projectIdentifier) {
      ...ProjectBuildBaronSettings
    }
  }
  ${PROJECT_BUILD_BARON_SETTINGS_FRAGMENT}
`;
